import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

describe("Step 01 — Project Setup", () => {
  describe(".env.local", () => {
    it("exists", () => {
      expect(existsSync(path.join(ROOT, ".env.local"))).toBe(true);
    });

    it("contains OPENWEATHERMAP_API_KEY", () => {
      const content = readFileSync(path.join(ROOT, ".env.local"), "utf-8");
      expect(content).toMatch(/OPENWEATHERMAP_API_KEY=/);
    });
  });

  describe(".gitignore", () => {
    it("ignores .env files", () => {
      const content = readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
      // Accepts .env.local or .env* wildcard
      const ignoresEnv =
        content.includes(".env.local") || content.includes(".env*");
      expect(ignoresEnv).toBe(true);
    });
  });

  describe("app/page.tsx", () => {
    it("has no default Next.js boilerplate (no 'Get started by editing')", () => {
      const content = readFileSync(path.join(ROOT, "app/page.tsx"), "utf-8");
      expect(content).not.toContain("Get started by editing");
    });

    it("is a server component (no 'use client' directive)", () => {
      const content = readFileSync(path.join(ROOT, "app/page.tsx"), "utf-8");
      expect(content).not.toMatch(/^["']use client["']/m);
    });
  });

  describe("package.json", () => {
    it("has a test script", () => {
      const pkg = JSON.parse(
        readFileSync(path.join(ROOT, "package.json"), "utf-8")
      );
      expect(pkg.scripts?.test).toBeTruthy();
    });
  });
});
