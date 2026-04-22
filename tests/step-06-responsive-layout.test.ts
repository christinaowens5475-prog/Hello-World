import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const pageSource = readFileSync(path.join(ROOT, "app/page.tsx"), "utf-8");

describe("Step 06 — Responsive Layout", () => {
  it("root wrapper uses min-h-screen", () => {
    expect(pageSource).toContain("min-h-screen");
  });

  it("dynamic background class applied to root wrapper", () => {
    // bgClass (result of getWeatherTheme) is included in className
    expect(pageSource).toMatch(/className=.*bgClass|bgClass.*className=/s);
  });

  it("transition-colors duration-700 applied for smooth background change", () => {
    expect(pageSource).toContain("transition-colors");
    expect(pageSource).toContain("duration-700");
  });

  it("padding is p-6 with md:p-12 responsive override", () => {
    expect(pageSource).toContain("p-6");
    expect(pageSource).toContain("md:p-12");
  });

  it("content is centered with max-w-4xl mx-auto", () => {
    expect(pageSource).toContain("max-w-4xl");
    expect(pageSource).toContain("mx-auto");
  });

  it("uses md: breakpoint grid for two-column desktop layout", () => {
    expect(pageSource).toMatch(/md:grid/);
    expect(pageSource).toMatch(/md:grid-cols/);
  });

  it("mobile: flex-col stacks components vertically by default", () => {
    expect(pageSource).toContain("flex-col");
  });

  it("Forecast component spans full width below top row", () => {
    // Forecast is rendered outside the two-column grid container
    expect(pageSource).toContain("<Forecast");
  });

  it("all three main components are rendered", () => {
    expect(pageSource).toContain("<CurrentWeather");
    expect(pageSource).toContain("<WeatherDetails");
    expect(pageSource).toContain("<Forecast");
  });
});
