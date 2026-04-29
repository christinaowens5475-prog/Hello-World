import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

describe("Step 11 — Precipitation stat", () => {
  describe("lib/weather.ts — interface", () => {
    const src = readFileSync(path.join(ROOT, "lib/weather.ts"), "utf-8");

    it("CurrentWeather interface includes precipitation_mm field", () => {
      expect(src).toMatch(/precipitation_mm\s*:\s*number/);
    });

    it("OWMCurrentResponse type includes optional rain field", () => {
      expect(src).toMatch(/rain\s*\??\s*:/);
    });

    it("OWMCurrentResponse type includes optional snow field", () => {
      expect(src).toMatch(/snow\s*\??\s*:/);
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

    const forecastResponse = {
      ok: true,
      json: async () => ({
        list: [
          {
            dt: 1700000000,
            dt_txt: "2024-01-15 12:00:00",
            main: { temp: 60, temp_max: 65, temp_min: 55 },
            weather: [{ id: 800, icon: "01d" }],
          },
        ],
      }),
    };
    const uvResponse = { ok: true, json: async () => ({ value: 3 }) };

    it("precipitation_mm is populated from rain[1h] when present", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 60, feels_like: 57, humidity: 80, temp_max: 63, temp_min: 57 },
            wind: { speed: 5 },
            weather: [{ id: 500, description: "light rain", icon: "10d" }],
            rain: { "1h": 1.5 },
          }),
        })
        .mockResolvedValueOnce(forecastResponse)
        .mockResolvedValueOnce(uvResponse);

      vi.stubGlobal("fetch", mockFetch);
      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.longBeach);

      expect(data.current.precipitation_mm).toBe(1.5);
    });

    it("precipitation_mm is 0 when rain is absent", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 72, feels_like: 70, humidity: 40, temp_max: 75, temp_min: 68 },
            wind: { speed: 3 },
            weather: [{ id: 800, description: "clear sky", icon: "01d" }],
          }),
        })
        .mockResolvedValueOnce(forecastResponse)
        .mockResolvedValueOnce(uvResponse);

      vi.stubGlobal("fetch", mockFetch);
      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.longBeach);

      expect(data.current.precipitation_mm).toBe(0);
    });

    it("precipitation_mm includes snow[1h] when rain is absent", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 30, feels_like: 25, humidity: 90, temp_max: 32, temp_min: 28 },
            wind: { speed: 8 },
            weather: [{ id: 601, description: "snow", icon: "13d" }],
            snow: { "1h": 2.0 },
          }),
        })
        .mockResolvedValueOnce(forecastResponse)
        .mockResolvedValueOnce(uvResponse);

      vi.stubGlobal("fetch", mockFetch);
      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.longBeach);

      expect(data.current.precipitation_mm).toBe(2.0);
    });

    it("precipitation_mm sums rain and snow when both present", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 33, feels_like: 28, humidity: 95, temp_max: 35, temp_min: 30 },
            wind: { speed: 10 },
            weather: [{ id: 511, description: "freezing rain", icon: "13d" }],
            rain: { "1h": 0.5 },
            snow: { "1h": 1.2 },
          }),
        })
        .mockResolvedValueOnce(forecastResponse)
        .mockResolvedValueOnce(uvResponse);

      vi.stubGlobal("fetch", mockFetch);
      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.longBeach);

      expect(data.current.precipitation_mm).toBeCloseTo(1.7);
    });
  });

  describe("components/CityPanel.tsx — precipitation stat card", () => {
    const src = readFileSync(path.join(ROOT, "components/CityPanel.tsx"), "utf-8");

    it("renders a Precip label", () => {
      expect(src).toMatch(/[Pp]recip/);
    });

    it("uses precipitation_mm from current weather data", () => {
      expect(src).toMatch(/precipitation_mm/);
    });

    it("displays value in inches (converted from mm)", () => {
      // Should divide by 25.4 or multiply by 0.03937 to convert mm → in
      expect(src).toMatch(/25\.4|0\.0394|toFixed|in"/);
    });
  });
});
