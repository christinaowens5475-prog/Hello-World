export const dynamic = "force-dynamic";

import { getWeatherData } from "@/lib/weather";
import { getWeatherTheme } from "@/lib/getWeatherTheme";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherDetails from "@/components/WeatherDetails";
import Forecast from "@/components/Forecast";

export default async function Home() {
  const data = await getWeatherData();
  const bgClass = getWeatherTheme(data.current.condition_id);

  return (
    <main
      className={`min-h-screen transition-colors duration-700 ${bgClass} p-6 md:p-12`}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Mobile: stack vertically. Desktop: two-column top row */}
        <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-6">
          <CurrentWeather
            temp={data.current.temp}
            feelsLike={data.current.feels_like}
            condition={data.current.description}
            icon={data.current.icon}
            cityName="Long Beach, CA"
          />
          <WeatherDetails
            humidity={data.current.humidity}
            windSpeed={data.current.wind_speed}
            uvIndex={data.current.uv_index}
          />
        </div>

        {/* Forecast spans full width */}
        <Forecast
          days={data.forecast.map((day) => ({
            date: day.date,
            high: day.high,
            low: day.low,
            conditionCode: day.condition_id,
            icon: day.icon,
          }))}
        />
      </div>
    </main>
  );
}
