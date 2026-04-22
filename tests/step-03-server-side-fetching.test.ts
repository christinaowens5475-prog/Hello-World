import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const pageSource = readFileSync(path.join(ROOT, "app/page.tsx"), "utf-8");

describe("Step 03 — Server-Side Data Fetching", () => {
  it("page.tsx has no 'use client' directive", () => {
    expect(pageSource).not.toMatch(/^["']use client["']/m);
  });

  it("page.tsx calls getWeatherData()", () => {
    expect(pageSource).toContain("getWeatherData()");
  });

  it("page.tsx imports getWeatherData from lib/weather", () => {
    expect(pageSource).toContain("from \"@/lib/weather\"");
  });

  it("page.tsx applies dynamic background class from getWeatherTheme", () => {
    expect(pageSource).toContain("getWeatherTheme");
    // Result should be used in a className
    expect(pageSource).toMatch(/className=.*\$\{bgClass\}|bgClass/);
  });

  it("loading.tsx exists for loading state", () => {
    const { existsSync } = require("fs");
    expect(existsSync(path.join(ROOT, "app/loading.tsx"))).toBe(true);
  });

  it("page component is async (server component pattern)", () => {
    expect(pageSource).toMatch(/export\s+default\s+async\s+function/);
  });

  it("export const dynamic = 'force-dynamic' prevents caching of page", () => {
    expect(pageSource).toContain('export const dynamic = "force-dynamic"');
  });
});
