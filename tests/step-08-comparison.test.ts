import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

describe("Step 08 — City Comparison", () => {
  describe("lib/weather.ts — multi-city support", () => {
    const src = readFileSync(path.join(ROOT, "lib/weather.ts"), "utf-8");

    it("exports CITIES constant", () => {
      expect(src).toMatch(/export\s+const\s+CITIES/);
    });

    it("CITIES includes Long Beach entry", () => {
      expect(src).toContain("Long Beach");
      expect(src).toContain("33.7701");
    });

    it("CITIES includes New York entry", () => {
      expect(src).toContain("New York");
      // NYC coords
      expect(src).toMatch(/40\.71|40\.73/); // common NYC lat values
    });

    it("exports CityConfig interface or type", () => {
      expect(src).toMatch(/export\s+(interface|type)\s+CityConfig/);
    });

    it("CityConfig has name, lat, lon fields", () => {
      expect(src).toMatch(/name\s*:\s*string/);
      expect(src).toMatch(/lat\s*:\s*number/);
      expect(src).toMatch(/lon\s*:\s*number/);
    });

    it("exports getWeatherDataForCity function", () => {
      expect(src).toMatch(/export\s+async\s+function\s+getWeatherDataForCity/);
    });

    it("getWeatherDataForCity accepts a CityConfig argument", () => {
      expect(src).toMatch(/getWeatherDataForCity\s*\(\s*\w+\s*:\s*CityConfig/);
    });
  });

  describe("lib/weather.ts — runtime behaviour", () => {
    beforeEach(() => {
      process.env.OPENWEATHERMAP_API_KEY = "test-key";
    });

    afterEach(() => {
      delete process.env.OPENWEATHERMAP_API_KEY;
      vi.unstubAllGlobals();
      vi.resetModules();
    });

    it("getWeatherDataForCity uses the city's lat/lon in API calls", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          main: { temp: 55, feels_like: 50, humidity: 70, temp_max: 58, temp_min: 52 },
          wind: { speed: 12 },
          weather: [{ id: 802, description: "scattered clouds", icon: "03d" }],
        }),
      });
      // Override forecast and UV calls too
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 55, feels_like: 50, humidity: 70, temp_max: 58, temp_min: 52 },
            wind: { speed: 12 },
            weather: [{ id: 802, description: "scattered clouds", icon: "03d" }],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            list: [
              {
                dt_txt: "2024-01-15 12:00:00",
                main: { temp_max: 58, temp_min: 50 },
                weather: [{ id: 802, icon: "03d" }],
              },
            ],
          }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ value: 2 }) });

      vi.stubGlobal("fetch", mockFetch);

      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      await getWeatherDataForCity(CITIES.newYork);

      const urls = mockFetch.mock.calls.map((c: [string]) => c[0]);
      expect(urls.some((u: string) => u.includes("40.7") || u.includes("40.7128"))).toBe(true);
      expect(urls.some((u: string) => u.includes("-74"))).toBe(true);
    });

    it("fetching both cities in parallel returns two WeatherData objects", async () => {
      const makeResponse = (temp: number, id: number) => ({
        ok: true,
        json: async () => ({
          main: { temp, feels_like: temp - 2, humidity: 60, temp_max: temp + 3, temp_min: temp - 3 },
          wind: { speed: 8 },
          weather: [{ id, description: "clear", icon: "01d" }],
        }),
      });
      const forecastResponse = {
        ok: true,
        json: async () => ({
          list: [
            {
              dt_txt: "2024-01-15 12:00:00",
              main: { temp_max: 70, temp_min: 55 },
              weather: [{ id: 800, icon: "01d" }],
            },
          ],
        }),
      };
      const uvResponse = { ok: true, json: async () => ({ value: 4 }) };

      const mockFetch = vi
        .fn()
        // LB: current, forecast, UV
        .mockResolvedValueOnce(makeResponse(64, 800))
        .mockResolvedValueOnce(forecastResponse)
        .mockResolvedValueOnce(uvResponse)
        // NY: current, forecast, UV
        .mockResolvedValueOnce(makeResponse(52, 802))
        .mockResolvedValueOnce(forecastResponse)
        .mockResolvedValueOnce(uvResponse);

      vi.stubGlobal("fetch", mockFetch);

      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const [lb, ny] = await Promise.all([
        getWeatherDataForCity(CITIES.longBeach),
        getWeatherDataForCity(CITIES.newYork),
      ]);

      expect(lb.current.temp).toBe(64);
      expect(ny.current.temp).toBe(52);
    });
  });

  describe("app/page.tsx — comparison layout", () => {
    const src = readFileSync(path.join(ROOT, "app/page.tsx"), "utf-8");

    it("fetches weather for both cities", () => {
      // Either calls getWeatherDataForCity twice or fetches both CITIES
      const hasBothCities =
        (src.match(/getWeatherDataForCity/g) ?? []).length >= 2 ||
        (src.includes("CITIES.longBeach") && src.includes("CITIES.newYork"));
      expect(hasBothCities).toBe(true);
    });

    it("references both cities (via CITIES constants or literal strings)", () => {
      const hasLongBeach =
        src.includes("CITIES.longBeach") || src.includes("Long Beach");
      const hasNewYork =
        src.includes("CITIES.newYork") || src.includes("New York");
      expect(hasLongBeach).toBe(true);
      expect(hasNewYork).toBe(true);
    });

    it("uses Promise.all to fetch both cities in parallel", () => {
      expect(src).toContain("Promise.all");
    });
  });
});
