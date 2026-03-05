import Image from "next/image";

interface ForecastDayProps {
  date: string;
  high: number;
  low: number;
  conditionCode: number;
  icon: string;
}

interface Props {
  days: ForecastDayProps[];
}

function dayName(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export default function Forecast({ days }: Props) {
  return (
    <div className="flex gap-3">
      {days.map((day) => (
        <div
          key={day.date}
          className="flex flex-col items-center gap-1 rounded-2xl bg-white/20 backdrop-blur-sm px-4 py-4 flex-1"
        >
          <p className="text-xs font-medium text-white/80">{dayName(day.date)}</p>
          <Image
            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt={`condition ${day.conditionCode}`}
            width={40}
            height={40}
            unoptimized
          />
          <p className="text-sm font-semibold text-white">{Math.round(day.high)}°</p>
          <p className="text-sm text-white/65">{Math.round(day.low)}°</p>
        </div>
      ))}
    </div>
  );
}
