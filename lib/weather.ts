const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface CityConfig {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
}

export const CITIES = {
  longBeach: { name: "Long Beach, CA", lat: 33.7701, lon: -118.1937, timezone: "America/Los_Angeles" } satisfies CityConfig,
  newYork:   { name: "New York, NY",   lat: 40.7128, lon: -74.0060,  timezone: "America/New_York"    } satisfies CityConfig,
};

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  condition_id: number;
  description: string;
  icon: string;
  uv_index: number;
}

export interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition_id: number;
  icon: string;
}

export interface HourlyEntry {
  time: string;
  temp: number;
  condition_id: number;
  icon: string;
}

export interface WeatherData {
  city: CityConfig;
  current: CurrentWeather;
  hourly: HourlyEntry[];
  forecast: ForecastDay[];
}

// Raw API response shapes
interface OWMCurrentResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  wind: { speed: number };
  weather: { id: number; description: string; icon: string }[];
}

interface OWMForecastEntry {
  dt: number;
  dt_txt: string;
  main: { temp: number; temp_max: number; temp_min: number };
  weather: { id: number; icon: string }[];
}

interface OWMForecastResponse {
  list: OWMForecastEntry[];
}

interface OWMUVResponse {
  value: number;
}

function apiKey(): string {
  const key = process.env.OPENWEATHERMAP_API_KEY;
  if (!key) throw new Error("OPENWEATHERMAP_API_KEY is not set");
  return key;
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) {
    throw new Error(`OpenWeatherMap API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function fetchCurrentWeather(lat: number, lon: number): Promise<OWMCurrentResponse> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey()}`;
  return fetchJSON<OWMCurrentResponse>(url);
}

function formatHour(dtUnix: number, timezone: string): string {
  return new Date(dtUnix * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
    timeZone: timezone,
  });
}

interface ForecastResult {
  hourly: HourlyEntry[];
  daily: ForecastDay[];
}

async function fetchForecast(lat: number, lon: number, timezone: string): Promise<ForecastResult> {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey()}`;
  const data = await fetchJSON<OWMForecastResponse>(url);

  // Next 4 entries = 12 hours at 3-hour intervals
  const hourly: HourlyEntry[] = data.list.slice(0, 4).map((entry) => ({
    time: formatHour(entry.dt, timezone),
    temp: entry.main.temp,
    condition_id: entry.weather[0].id,
    icon: entry.weather[0].icon,
  }));

  // Group remaining entries by day for 5-day forecast
  const byDay = new Map<string, OWMForecastEntry[]>();
  for (const entry of data.list) {
    const day = entry.dt_txt.slice(0, 10);
    const existing = byDay.get(day) ?? [];
    existing.push(entry);
    byDay.set(day, existing);
  }

  const daily: ForecastDay[] = Array.from(byDay.entries())
    .slice(0, 5)
    .map(([date, entries]) => ({
      date,
      high: Math.max(...entries.map((e) => e.main.temp_max)),
      low: Math.min(...entries.map((e) => e.main.temp_min)),
      condition_id: entries[0].weather[0].id,
      icon: entries[0].weather[0].icon,
    }));

  return { hourly, daily };
}

async function fetchUVIndex(lat: number, lon: number): Promise<number> {
  const url = `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${apiKey()}`;
  const data = await fetchJSON<OWMUVResponse>(url);
  return data.value;
}

export async function getWeatherDataForCity(city: CityConfig): Promise<WeatherData> {
  const { lat, lon } = city;
  const [current, { hourly, daily }, uv_index] = await Promise.all([
    fetchCurrentWeather(lat, lon),
    fetchForecast(lat, lon, city.timezone),
    fetchUVIndex(lat, lon),
  ]);

  return {
    city,
    current: {
      temp: current.main.temp ?? current.main.temp_max,
      feels_like: current.main.feels_like ?? current.main.temp,
      humidity: current.main.humidity,
      wind_speed: current.wind.speed,
      condition_id: current.weather[0].id,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      uv_index,
    },
    hourly,
    forecast: daily,
  };
}

// Convenience wrapper kept for backwards compatibility
export async function getWeatherData(): Promise<WeatherData> {
  return getWeatherDataForCity(CITIES.longBeach);
}
