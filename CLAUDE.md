# Long Beach Weather App — CLAUDE.md

## Project
Next.js 16 weather app hardcoded to Long Beach, CA. Displays current conditions + 5-day forecast with a dynamic background that changes with weather conditions.

## Stack
- **Next.js 16** (App Router, server components)
- **TypeScript** strict mode
- **Tailwind CSS v4** — dynamic class-based theming
- **OpenWeatherMap API** — current, forecast, UV endpoints
- **Vitest** — test framework

## Key Files
- `lib/weather.ts` — API service layer (interfaces + fetching)
- `lib/getWeatherTheme.ts` — maps OWM condition codes to Tailwind gradient classes
- `components/CurrentWeather.tsx` — temp, condition, city
- `components/WeatherDetails.tsx` — humidity, wind, UV index
- `components/Forecast.tsx` — 5-day strip
- `app/page.tsx` — server component that composes everything

## Commands
```
pnpm dev        # dev server
pnpm build      # production build
pnpm test       # run Vitest
```

## Critical Rules
- **NEVER** use dynamic Tailwind class names (`bg-${color}-300` breaks purging)
- API key lives in `.env.local` only — never in client components
- All components default to server components unless interactivity is needed
- TypeScript strict mode — no `any`

## Requests Progress
- [x] step-01 — Project Setup
- [x] step-02 — API Integration
- [x] step-03 — Server-Side Fetching
- [x] step-04 — Dynamic Background
- [x] step-05 — UI Components
- [x] step-06 — Responsive Layout
- [x] step-07 — Deploy to Vercel (build passing, pushed to GitHub)

## Coordinates
Long Beach, CA: lat=33.7701, lon=-118.1937, units=imperial
