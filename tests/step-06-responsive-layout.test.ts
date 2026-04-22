import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const pageSource = readFileSync(path.join(ROOT, "app/page.tsx"), "utf-8");
const panelSource = readFileSync(path.join(ROOT, "components/CityPanel.tsx"), "utf-8");

describe("Step 06 — Responsive Layout", () => {
  it("root wrapper uses min-h-screen", () => {
    expect(pageSource).toContain("min-h-screen");
  });

  it("page has responsive padding", () => {
    // Accepts p-4/p-6 with md override
    expect(pageSource).toMatch(/p-\d+/);
    expect(pageSource).toMatch(/md:p-\d+/);
  });

  it("content is centered with max-w and mx-auto", () => {
    expect(pageSource).toMatch(/max-w-\w+/);
    expect(pageSource).toContain("mx-auto");
  });

  it("mobile: components stack vertically by default", () => {
    expect(pageSource).toContain("flex-col");
  });

  it("desktop: comparison panels are side by side (md:flex-row)", () => {
    expect(pageSource).toContain("md:flex-row");
  });

  it("both city panels are rendered", () => {
    expect(pageSource).toContain("<CityPanel");
    const panelCount = (pageSource.match(/<CityPanel/g) ?? []).length;
    expect(panelCount).toBe(2);
  });

  it("CityPanel applies dynamic background theme per city", () => {
    expect(panelSource).toContain("bgClass");
    expect(pageSource).toContain("getWeatherTheme");
  });

  it("CityPanel has its own responsive layout", () => {
    // CityPanel stacks its sections vertically
    expect(panelSource).toContain("flex-col");
  });

  it("each city panel includes forecast strip", () => {
    expect(panelSource).toContain("forecast");
  });
});
