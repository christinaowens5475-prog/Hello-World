import Image from "next/image";

interface Props {
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  cityName: string;
}

export default function CurrentWeather({ temp, feelsLike, condition, icon, cityName }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/20 backdrop-blur-sm p-8">
      <h1 className="text-2xl font-semibold text-white drop-shadow">{cityName}</h1>
      <Image
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={condition}
        width={100}
        height={100}
        unoptimized
      />
      <p className="text-7xl font-bold text-white drop-shadow">
        {Number.isFinite(temp) ? `${Math.round(temp)}°F` : "--"}
      </p>
      <p className="text-xl capitalize text-white/90 drop-shadow">{condition}</p>
      <p className="text-sm text-white/75">
        Feels like {Number.isFinite(feelsLike) ? `${Math.round(feelsLike)}°F` : "--"}
      </p>
    </div>
  );
}
