import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

describe("Step 10 — Localized Timezones", () => {
  describe("lib/weather.ts — CityConfig and CITIES", () => {
    const src = readFileSync(path.join(ROOT, "lib/weather.ts"), "utf-8");

    it("CityConfig interface includes timezone field", () => {
      const match = src.match(/interface CityConfig\s*\{([^}]+)\}/);
      expect(match).not.toBeNull();
      expect(match![1]).toMatch(/timezone\s*:\s*string/);
    });

    it("Long Beach uses America/Los_Angeles timezone", () => {
      expect(src).toContain("America/Los_Angeles");
    });

    it("New York uses America/New_York timezone", () => {
      expect(src).toContain("America/New_York");
    });
  });

  describe("lib/weather.ts — runtime: times are city-local", () => {
    beforeEach(() => {
      process.env.OPENWEATHERMAP_API_KEY = "test-key";
    });
    afterEach(() => {
      delete process.env.OPENWEATHERMAP_API_KEY;
      vi.unstubAllGlobals();
      vi.resetModules();
    });

    function makeWeatherMock(mockFetch: ReturnType<typeof vi.fn>) {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 64, feels_like: 62, humidity: 60, temp_max: 67, temp_min: 60 },
            wind: { speed: 8 },
            weather: [{ id: 800, description: "clear sky", icon: "01d" }],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            list: [
              // 2024-01-15 20:00 UTC
              // = 12 PM PST (Los Angeles, UTC-8 in January)
              // = 3 PM EST (New York, UTC-5 in January)
              { dt: 1705348800, dt_txt: "2024-01-15 20:00:00", main: { temp: 64, temp_max: 66, temp_min: 62 }, weather: [{ id: 800, icon: "01d" }] },
              { dt: 1705359600, dt_txt: "2024-01-15 23:00:00", main: { temp: 62, temp_max: 64, temp_min: 60 }, weather: [{ id: 800, icon: "01n" }] },
              { dt: 1705370400, dt_txt: "2024-01-16 02:00:00", main: { temp: 60, temp_max: 62, temp_min: 58 }, weather: [{ id: 800, icon: "01n" }] },
              { dt: 1705381200, dt_txt: "2024-01-16 05:00:00", main: { temp: 58, temp_max: 60, temp_min: 56 }, weather: [{ id: 800, icon: "01n" }] },
            ],
          }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ value: 3 }) });
    }

    it("Long Beach hourly times are in PST/PDT (America/Los_Angeles)", async () => {
      const mockFetch = vi.fn();
      makeWeatherMock(mockFetch);
      vi.stubGlobal("fetch", mockFetch);

      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.longBeach);

      // 2024-01-15 20:00 UTC = 12:00 PM PST
      expect(data.hourly[0].time).toMatch(/12\s*(PM|pm)/i);
    });

    it("New York hourly times are in EST/EDT (America/New_York)", async () => {
      const mockFetch = vi.fn();
      makeWeatherMock(mockFetch);
      vi.stubGlobal("fetch", mockFetch);

      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.newYork);

      // 2024-01-15 20:00 UTC = 3:00 PM EST
      expect(data.hourly[0].time).toMatch(/3\s*(PM|pm)/i);
    });

    it("Long Beach and New York show different times for the same UTC timestamp", async () => {
      const mockFetchLB = vi.fn();
      makeWeatherMock(mockFetchLB);
      vi.stubGlobal("fetch", mockFetchLB);

      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const lb = await getWeatherDataForCity(CITIES.longBeach);

      vi.resetModules();
      vi.unstubAllGlobals();
      process.env.OPENWEATHERMAP_API_KEY = "test-key";

      const mockFetchNY = vi.fn();
      makeWeatherMock(mockFetchNY);
      vi.stubGlobal("fetch", mockFetchNY);

      const { getWeatherDataForCity: getWeatherDataForCity2, CITIES: CITIES2 } =
        await import("../lib/weather");
      const ny = await getWeatherDataForCity2(CITIES2.newYork);

      expect(lb.hourly[0].time).not.toBe(ny.hourly[0].time);
    });
  });
});
