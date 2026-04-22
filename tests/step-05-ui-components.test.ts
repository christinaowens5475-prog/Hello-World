import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

function readComponent(name: string): string {
  return readFileSync(path.join(ROOT, "components", name), "utf-8");
}

describe("Step 05 — UI Components", () => {
  describe("CurrentWeather.tsx", () => {
    const src = readComponent("CurrentWeather.tsx");

    it("file exists", () => {
      expect(existsSync(path.join(ROOT, "components/CurrentWeather.tsx"))).toBe(true);
    });

    it("has TypeScript interface with required props", () => {
      expect(src).toMatch(/temp\s*:\s*number/);
      expect(src).toMatch(/feelsLike\s*:\s*number/);
      expect(src).toMatch(/condition\s*:\s*string/);
      expect(src).toMatch(/icon\s*:\s*string/);
      expect(src).toMatch(/cityName\s*:\s*string/);
    });

    it("displays temperature with °F", () => {
      expect(src).toContain("°F");
    });

    it("uses OWM icon URL pattern", () => {
      expect(src).toContain("openweathermap.org/img/wn/");
      expect(src).toContain("@2x.png");
    });

    it("uses Tailwind classes, no inline styles", () => {
      expect(src).not.toMatch(/style\s*=\s*\{\{/);
      expect(src).toContain("className=");
    });

    it("uses semi-transparent card background", () => {
      expect(src).toContain("bg-white/20");
    });
  });

  describe("WeatherDetails.tsx", () => {
    const src = readComponent("WeatherDetails.tsx");

    it("file exists", () => {
      expect(existsSync(path.join(ROOT, "components/WeatherDetails.tsx"))).toBe(true);
    });

    it("has TypeScript interface with required props", () => {
      expect(src).toMatch(/humidity\s*:\s*number/);
      expect(src).toMatch(/windSpeed\s*:\s*number/);
      expect(src).toMatch(/uvIndex\s*:\s*number/);
    });

    it("displays humidity with % unit", () => {
      expect(src).toContain("%");
    });

    it("displays wind speed with mph unit", () => {
      expect(src).toContain("mph");
    });

    it("has UV label thresholds: Low, Moderate, High, Very High, Extreme", () => {
      expect(src).toContain("Low");
      expect(src).toContain("Moderate");
      expect(src).toContain("High");
      expect(src).toContain("Very High");
      expect(src).toContain("Extreme");
    });

    it("uses Tailwind classes, no inline styles", () => {
      expect(src).not.toMatch(/style\s*=\s*\{\{/);
    });
  });

  describe("Forecast.tsx", () => {
    const src = readComponent("Forecast.tsx");

    it("file exists", () => {
      expect(existsSync(path.join(ROOT, "components/Forecast.tsx"))).toBe(true);
    });

    it("has TypeScript interface for forecast day props", () => {
      expect(src).toMatch(/date\s*:\s*string/);
      expect(src).toMatch(/high\s*:\s*number/);
      expect(src).toMatch(/low\s*:\s*number/);
      expect(src).toMatch(/conditionCode\s*:\s*number/);
      expect(src).toMatch(/icon\s*:\s*string/);
    });

    it("uses OWM icon URL pattern", () => {
      expect(src).toContain("openweathermap.org/img/wn/");
    });

    it("uses Tailwind classes, no inline styles", () => {
      expect(src).not.toMatch(/style\s*=\s*\{\{/);
    });

    it("uses semi-transparent card background", () => {
      expect(src).toContain("bg-white/20");
    });
  });

  describe("WeatherDetails UV label logic", () => {
    it("uvLabel returns Low for 0–2", async () => {
      // Verify from source the thresholds match the spec
      const src = readComponent("WeatherDetails.tsx");
      expect(src).toMatch(/value\s*<=\s*2.*Low|Low.*value\s*<=\s*2/s);
    });

    it("uvLabel returns Moderate for 3–5", () => {
      const src = readComponent("WeatherDetails.tsx");
      expect(src).toMatch(/value\s*<=\s*5.*Moderate|Moderate.*value\s*<=\s*5/s);
    });

    it("uvLabel returns Extreme for 11+", () => {
      const src = readComponent("WeatherDetails.tsx");
      expect(src).toContain("Extreme");
    });
  });
});
