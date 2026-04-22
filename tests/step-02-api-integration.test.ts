import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

// ── Structural checks (static analysis via source text) ──────────────────────

describe("Step 02 — API Integration (structural)", () => {
  const source = readFileSync(path.join(ROOT, "lib/weather.ts"), "utf-8");

  it("API key is read from process.env, never hardcoded", () => {
    // Should not contain a bare string that looks like an OWM key (32-char hex)
    expect(source).not.toMatch(/appid=["'][0-9a-f]{32}["']/);
    // Should reference process.env
    expect(source).toContain("process.env.OPENWEATHERMAP_API_KEY");
  });

  it("exports getWeatherData function", () => {
    expect(source).toMatch(/export\s+async\s+function\s+getWeatherData/);
  });

  it("exports CurrentWeather, ForecastDay, WeatherData interfaces", () => {
    expect(source).toContain("export interface CurrentWeather");
    expect(source).toContain("export interface ForecastDay");
    expect(source).toContain("export interface WeatherData");
  });

  it("WeatherData interface has current and forecast fields", () => {
    expect(source).toMatch(/current\s*:\s*CurrentWeather/);
    expect(source).toMatch(/forecast\s*:\s*ForecastDay\[\]/);
  });

  it("uses imperial units in API calls", () => {
    expect(source).toContain("units=imperial");
  });

  it("uses Long Beach coordinates", () => {
    expect(source).toContain("33.7701");
    expect(source).toContain("-118.1937");
  });
});

// ── Runtime behaviour (mocked fetch) ────────────────────────────────────────

describe("Step 02 — API Integration (runtime)", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env.OPENWEATHERMAP_API_KEY = "test-key-12345";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.OPENWEATHERMAP_API_KEY;
    vi.resetModules();
  });

  it("throws descriptive error when API key is missing", async () => {
    delete process.env.OPENWEATHERMAP_API_KEY;
    // Re-import after clearing env
    const { getWeatherData } = await import("../lib/weather");
    await expect(getWeatherData()).rejects.toThrow(
      "OPENWEATHERMAP_API_KEY is not set"
    );
  });

  it("throws descriptive error when API returns non-ok status", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });
    vi.stubGlobal("fetch", mockFetch);

    const { getWeatherData } = await import("../lib/weather");
    await expect(getWeatherData()).rejects.toThrow("OpenWeatherMap API error");
  });

  it("getWeatherData returns WeatherData shape with correct fields", async () => {
    const mockCurrent = {
      main: { temp: 72, feels_like: 70, humidity: 65, temp_max: 75, temp_min: 68 },
      wind: { speed: 10 },
      weather: [{ id: 800, description: "clear sky", icon: "01d" }],
    };
    const mockForecast = {
      list: [
        {
          dt_txt: "2024-01-15 12:00:00",
          main: { temp_max: 75, temp_min: 62 },
          weather: [{ id: 800, icon: "01d" }],
        },
        {
          dt_txt: "2024-01-16 12:00:00",
          main: { temp_max: 73, temp_min: 60 },
          weather: [{ id: 801, icon: "02d" }],
        },
      ],
    };
    const mockUV = { value: 5.2 };

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockCurrent })
      .mockResolvedValueOnce({ ok: true, json: async () => mockForecast })
      .mockResolvedValueOnce({ ok: true, json: async () => mockUV });
    vi.stubGlobal("fetch", mockFetch);

    const { getWeatherData } = await import("../lib/weather");
    const data = await getWeatherData();

    // current shape
    expect(data.current).toMatchObject({
      temp: 72,
      feels_like: 70,
      humidity: 65,
      wind_speed: 10,
      condition_id: 800,
      description: "clear sky",
      icon: "01d",
      uv_index: 5.2,
    });

    // forecast array
    expect(Array.isArray(data.forecast)).toBe(true);
    expect(data.forecast.length).toBeGreaterThan(0);
    const day = data.forecast[0];
    expect(typeof day.date).toBe("string");
    expect(typeof day.high).toBe("number");
    expect(typeof day.low).toBe("number");
    expect(typeof day.condition_id).toBe("number");
    expect(typeof day.icon).toBe("string");
  });

  it("forecast reduces 3-hour entries to daily entries (max 5 days)", async () => {
    // Build 6 days × 8 entries each = 48 entries
    const list = Array.from({ length: 48 }, (_, i) => {
      const day = String(Math.floor(i / 8) + 1).padStart(2, "0");
      return {
        dt_txt: `2024-01-${day} ${String((i % 8) * 3).padStart(2, "0")}:00:00`,
        main: { temp_max: 70 + i, temp_min: 50 + i },
        weather: [{ id: 800, icon: "01d" }],
      };
    });

    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          main: { temp: 70, feels_like: 68, humidity: 60, temp_max: 72, temp_min: 65 },
          wind: { speed: 8 },
          weather: [{ id: 800, description: "sunny", icon: "01d" }],
        }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ list }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ value: 3 }) });
    vi.stubGlobal("fetch", mockFetch);

    const { getWeatherData } = await import("../lib/weather");
    const data = await getWeatherData();

    expect(data.forecast.length).toBeLessThanOrEqual(5);
  });
});
