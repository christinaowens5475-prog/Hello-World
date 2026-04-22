export const dynamic = "force-dynamic";

import { getWeatherDataForCity, CITIES } from "@/lib/weather";
import { getWeatherTheme } from "@/lib/getWeatherTheme";
import CityPanel from "@/components/CityPanel";

export default async function Home() {
  const [longBeach, newYork] = await Promise.all([
    getWeatherDataForCity(CITIES.longBeach),
    getWeatherDataForCity(CITIES.newYork),
  ]);

  return (
    <main className="min-h-screen bg-slate-900 p-4 md:p-8">
      <h1 className="text-center text-white/60 text-sm font-medium uppercase tracking-widest mb-6">
        Weather Comparison
      </h1>

      {/* Mobile: stack. Desktop: side by side */}
      <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
        <CityPanel
          data={longBeach}
          bgClass={getWeatherTheme(longBeach.current.condition_id)}
        />
        <CityPanel
          data={newYork}
          bgClass={getWeatherTheme(newYork.current.condition_id)}
        />
      </div>
    </main>
  );
}
