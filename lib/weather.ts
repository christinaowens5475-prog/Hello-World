const BASE_URL = "https://api.openweathermap.org/data/2.5";
const LAT = 33.7701;
const LON = -118.1937;

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

export interface WeatherData {
  current: CurrentWeather;
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
  dt_txt: string;
  main: { temp_max: number; temp_min: number };
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

async function getCurrentWeather(): Promise<OWMCurrentResponse> {
  const url = `${BASE_URL}/weather?lat=${LAT}&lon=${LON}&units=imperial&appid=${apiKey()}`;
  return fetchJSON<OWMCurrentResponse>(url);
}

async function getForecast(): Promise<ForecastDay[]> {
  const url = `${BASE_URL}/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${apiKey()}`;
  const data = await fetchJSON<OWMForecastResponse>(url);

  const byDay = new Map<string, OWMForecastEntry[]>();
  for (const entry of data.list) {
    const day = entry.dt_txt.slice(0, 10);
    const existing = byDay.get(day) ?? [];
    existing.push(entry);
    byDay.set(day, existing);
  }

  return Array.from(byDay.entries())
    .slice(0, 5)
    .map(([date, entries]) => ({
      date,
      high: Math.max(...entries.map((e) => e.main.temp_max)),
      low: Math.min(...entries.map((e) => e.main.temp_min)),
      condition_id: entries[0].weather[0].id,
      icon: entries[0].weather[0].icon,
    }));
}

async function getUVIndex(): Promise<number> {
  const url = `${BASE_URL}/uvi?lat=${LAT}&lon=${LON}&appid=${apiKey()}`;
  const data = await fetchJSON<OWMUVResponse>(url);
  return data.value;
}

export async function getWeatherData(): Promise<WeatherData> {
  const [current, forecast, uv_index] = await Promise.all([
    getCurrentWeather(),
    getForecast(),
    getUVIndex(),
  ]);

  return {
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
    forecast,
  };
}
