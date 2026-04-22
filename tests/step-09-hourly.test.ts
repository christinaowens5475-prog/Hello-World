import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

describe("Step 09 — 12-Hour Forecast", () => {
  describe("lib/weather.ts — HourlyEntry type and data", () => {
    const src = readFileSync(path.join(ROOT, "lib/weather.ts"), "utf-8");

    it("exports HourlyEntry interface", () => {
      expect(src).toMatch(/export\s+interface\s+HourlyEntry/);
    });

    it("HourlyEntry has time, temp, condition_id, icon fields", () => {
      // Extract just the HourlyEntry block to avoid false positives
      const match = src.match(/interface HourlyEntry\s*\{([^}]+)\}/);
      expect(match).not.toBeNull();
      const body = match![1];
      expect(body).toMatch(/time\s*:\s*string/);
      expect(body).toMatch(/temp\s*:\s*number/);
      expect(body).toMatch(/condition_id\s*:\s*number/);
      expect(body).toMatch(/icon\s*:\s*string/);
    });

    it("WeatherData includes hourly array", () => {
      const match = src.match(/interface WeatherData\s*\{([^}]+)\}/);
      expect(match).not.toBeNull();
      const body = match![1];
      expect(body).toMatch(/hourly\s*:\s*HourlyEntry\[\]/);
    });
  });

  describe("lib/weather.ts — runtime: hourly slice", () => {
    beforeEach(() => {
      process.env.OPENWEATHERMAP_API_KEY = "test-key";
    });
    afterEach(() => {
      delete process.env.OPENWEATHERMAP_API_KEY;
      vi.unstubAllGlobals();
      vi.resetModules();
    });

    it("getWeatherDataForCity returns exactly 4 hourly entries (12h / 3h intervals)", async () => {
      // 10 forecast entries spanning multiple days
      const list = Array.from({ length: 10 }, (_, i) => ({
        dt: 1700000000 + i * 10800, // 3-hour steps
        dt_txt: `2024-01-15 ${String(i * 3).padStart(2, "0")}:00:00`,
        main: { temp: 60 + i, temp_max: 62 + i, temp_min: 58 + i },
        weather: [{ id: 800, icon: "01d" }],
      }));

      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 64, feels_like: 62, humidity: 60, temp_max: 67, temp_min: 60 },
            wind: { speed: 8 },
            weather: [{ id: 800, description: "clear sky", icon: "01d" }],
          }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ list }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ value: 3 }) });

      vi.stubGlobal("fetch", mockFetch);

      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.longBeach);

      expect(Array.isArray(data.hourly)).toBe(true);
      expect(data.hourly.length).toBe(4);
    });

    it("hourly entries have correct shape", async () => {
      const list = Array.from({ length: 6 }, (_, i) => ({
        dt: 1700000000 + i * 10800,
        dt_txt: `2024-01-15 ${String(i * 3).padStart(2, "0")}:00:00`,
        main: { temp: 60 + i, temp_max: 62 + i, temp_min: 58 + i },
        weather: [{ id: 801, icon: "02d" }],
      }));

      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 64, feels_like: 62, humidity: 60, temp_max: 67, temp_min: 60 },
            wind: { speed: 8 },
            weather: [{ id: 800, description: "clear", icon: "01d" }],
          }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ list }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ value: 3 }) });

      vi.stubGlobal("fetch", mockFetch);

      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.longBeach);
      const entry = data.hourly[0];

      expect(typeof entry.time).toBe("string");
      expect(entry.time.length).toBeGreaterThan(0);
      expect(typeof entry.temp).toBe("number");
      expect(typeof entry.condition_id).toBe("number");
      expect(typeof entry.icon).toBe("string");
    });

    it("hourly time is formatted as a human-readable hour (e.g. '3 PM')", async () => {
      // dt corresponds to a known time: 1700049600 = 2023-11-15 12:00:00 UTC
      const list = Array.from({ length: 6 }, (_, i) => ({
        dt: 1700049600 + i * 10800,
        dt_txt: `2023-11-15 ${String(12 + i * 3).padStart(2, "0")}:00:00`,
        main: { temp: 60, temp_max: 62, temp_min: 58 },
        weather: [{ id: 800, icon: "01d" }],
      }));

      const mockFetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            main: { temp: 64, feels_like: 62, humidity: 60, temp_max: 67, temp_min: 60 },
            wind: { speed: 8 },
            weather: [{ id: 800, description: "clear", icon: "01d" }],
          }),
        })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ list }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ value: 3 }) });

      vi.stubGlobal("fetch", mockFetch);

      const { getWeatherDataForCity, CITIES } = await import("../lib/weather");
      const data = await getWeatherDataForCity(CITIES.longBeach);

      // Time should be a formatted string, not a raw ISO timestamp
      expect(data.hourly[0].time).not.toMatch(/T\d{2}:\d{2}/); // not ISO
      expect(data.hourly[0].time.length).toBeGreaterThan(0);
    });
  });

  describe("components/CityPanel.tsx — 12-hour strip UI", () => {
    const src = readFileSync(path.join(ROOT, "components/CityPanel.tsx"), "utf-8");

    it("renders the hourly prop", () => {
      expect(src).toContain("hourly");
    });

    it("maps over hourly entries to display each slot", () => {
      expect(src).toMatch(/hourly\.map/);
    });

    it("displays time for each hourly entry", () => {
      expect(src).toMatch(/entry\.time|hour\.time|h\.time/);
    });

    it("displays temperature for each hourly entry", () => {
      expect(src).toMatch(/entry\.temp|hour\.temp|h\.temp/);
    });

    it("displays weather icon for each hourly entry", () => {
      expect(src).toMatch(/entry\.icon|hour\.icon|h\.icon/);
    });

    it("has a '12-Hour' or 'Hourly' label", () => {
      expect(src).toMatch(/12.Hour|12-Hour|Hourly/i);
    });
  });
});
