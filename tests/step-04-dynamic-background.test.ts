import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { getWeatherTheme } from "../lib/getWeatherTheme";

const ROOT = path.resolve(__dirname, "..");
const source = readFileSync(path.join(ROOT, "lib/getWeatherTheme.ts"), "utf-8");

describe("Step 04 — Dynamic Background", () => {
  describe("function signature", () => {
    it("is a function accepting a number and returning a string", () => {
      expect(typeof getWeatherTheme).toBe("function");
      expect(typeof getWeatherTheme(800)).toBe("string");
    });

    it("exported function signature is typed (code: number): string", () => {
      expect(source).toMatch(/function\s+getWeatherTheme\s*\(\s*code\s*:\s*number\s*\)\s*:\s*string/);
    });
  });

  describe("condition code coverage", () => {
    it("thunderstorm (200–232) returns dark blue gradient", () => {
      expect(getWeatherTheme(200)).toContain("blue");
      expect(getWeatherTheme(232)).toContain("blue");
      expect(getWeatherTheme(215)).toContain("blue");
    });

    it("drizzle (300–321) returns blue gradient", () => {
      expect(getWeatherTheme(300)).toContain("blue");
      expect(getWeatherTheme(321)).toContain("blue");
    });

    it("rain (500–531) returns blue gradient", () => {
      expect(getWeatherTheme(500)).toContain("blue");
      expect(getWeatherTheme(531)).toContain("blue");
    });

    it("snow (600–622) returns grey/gray gradient", () => {
      const result = getWeatherTheme(600);
      expect(result.toLowerCase()).toMatch(/gray|grey/);
    });

    it("atmosphere/fog (700–781) returns grey/gray gradient", () => {
      const result = getWeatherTheme(741);
      expect(result.toLowerCase()).toMatch(/gray|grey/);
    });

    it("clear sky (800) returns yellow gradient", () => {
      expect(getWeatherTheme(800)).toContain("yellow");
    });

    it("cloudy (801–804) returns grey/gray gradient", () => {
      expect(getWeatherTheme(801).toLowerCase()).toMatch(/gray|grey/);
      expect(getWeatherTheme(804).toLowerCase()).toMatch(/gray|grey/);
    });

    it("unknown code falls back to a defined class", () => {
      const result = getWeatherTheme(999);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("Tailwind class safety", () => {
    it("returns complete static class strings (not dynamic concatenation)", () => {
      // No template literal with variable colors in the source
      expect(source).not.toMatch(/`bg-\$\{/);
    });

    it("all returned values start with 'bg-'", () => {
      const codes = [200, 300, 500, 600, 741, 800, 801, 999];
      for (const code of codes) {
        expect(getWeatherTheme(code)).toMatch(/^bg-/);
      }
    });

    it("all returned values include 'gradient'", () => {
      const codes = [200, 300, 500, 600, 741, 800, 801, 999];
      for (const code of codes) {
        expect(getWeatherTheme(code)).toContain("gradient");
      }
    });
  });
});
