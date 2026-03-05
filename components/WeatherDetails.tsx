interface Props {
  humidity: number;
  windSpeed: number;
  uvIndex: number;
}

function uvLabel(value: number): string {
  if (value <= 2) return "Low";
  if (value <= 5) return "Moderate";
  if (value <= 7) return "High";
  if (value <= 10) return "Very High";
  return "Extreme";
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/20 backdrop-blur-sm p-4 flex-1">
      <p className="text-xs font-medium uppercase tracking-widest text-white/70">{label}</p>
      <p className="text-xl font-semibold text-white drop-shadow text-center">{value}</p>
    </div>
  );
}

export default function WeatherDetails({ humidity, windSpeed, uvIndex }: Props) {
  return (
    <div className="flex md:flex-col gap-3">
      <StatCard label="Humidity" value={`${humidity}%`} />
      <StatCard label="Wind" value={`${Math.round(windSpeed)} mph`} />
      <StatCard label="UV Index" value={`${uvIndex} · ${uvLabel(uvIndex)}`} />
    </div>
  );
}
