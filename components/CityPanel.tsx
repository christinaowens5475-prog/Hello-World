import Image from "next/image";
import type { WeatherData } from "@/lib/weather";

interface Props {
  data: WeatherData;
  bgClass: string;
}

function uvLabel(value: number): string {
  if (value <= 2) return "Low";
  if (value <= 5) return "Moderate";
  if (value <= 7) return "High";
  if (value <= 10) return "Very High";
  return "Extreme";
}

function dayName(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function formatTemp(value: number): string {
  return Number.isFinite(value) ? `${Math.round(value)}°` : "--";
}

export default function CityPanel({ data, bgClass }: Props) {
  const { city, current, hourly, forecast } = data;

  return (
    <div className={`flex-1 rounded-3xl ${bgClass} p-5 flex flex-col gap-4`}>
      {/* City name */}
      <h2 className="text-center text-white font-semibold text-lg drop-shadow">
        {city.name}
      </h2>

      {/* Current conditions */}
      <div className="flex items-center justify-between gap-4 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-1">
          <p className="text-5xl font-bold text-white drop-shadow">
            {Number.isFinite(current.temp) ? `${Math.round(current.temp)}°F` : "--"}
          </p>
          <p className="text-sm capitalize text-white/85">{current.description}</p>
          <p className="text-xs text-white/65">
            Feels like{" "}
            {Number.isFinite(current.feels_like)
              ? `${Math.round(current.feels_like)}°F`
              : "--"}
          </p>
        </div>
        <Image
          src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
          alt={current.description}
          width={80}
          height={80}
          unoptimized
        />
      </div>

      {/* Detail stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Humidity", value: `${current.humidity}%` },
          { label: "Wind",     value: `${Math.round(current.wind_speed)} mph` },
          { label: "UV Index", value: `${current.uv_index} · ${uvLabel(current.uv_index)}` },
          { label: "Precip",   value: `${(current.precipitation_mm / 25.4).toFixed(2)} in` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 bg-white/15 backdrop-blur-sm rounded-xl py-3 px-2"
          >
            <p className="text-xs uppercase tracking-wider text-white/60">{label}</p>
            <p className="text-sm font-semibold text-white text-center">{value}</p>
          </div>
        ))}
      </div>

      {/* 12-Hour forecast */}
      <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wider text-white/60">12-Hour</p>
        <div className="flex gap-2">
          {hourly.map((entry) => (
            <div
              key={entry.time}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <p className="text-xs text-white/70">{entry.time}</p>
              <Image
                src={`https://openweathermap.org/img/wn/${entry.icon}@2x.png`}
                alt={`condition ${entry.condition_id}`}
                width={32}
                height={32}
                unoptimized
              />
              <p className="text-xs font-semibold text-white">
                {formatTemp(entry.temp)}F
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day forecast strip */}
      <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wider text-white/60">5-Day</p>
        <div className="flex gap-2">
          {forecast.map((day) => (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <p className="text-xs text-white/70">{dayName(day.date)}</p>
              <Image
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={`condition ${day.condition_id}`}
                width={32}
                height={32}
                unoptimized
              />
              <p className="text-xs font-semibold text-white">{formatTemp(day.high)}F</p>
              <p className="text-xs text-white/60">{formatTemp(day.low)}F</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
