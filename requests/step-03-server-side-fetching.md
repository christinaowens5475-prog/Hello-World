# Step 3 — Server-Side Data Fetching

## Task
Wire up the weather data fetching in the Next.js App Router server component so data loads securely on the server.

## Instructions
1. Open `app/page.tsx`
2. Mark it as a server component (no `"use client"` directive — server is the default)
3. Call `getWeatherData()` from `lib/weather.ts` at the top of the component
4. Pass the returned data as props to the UI components (CurrentWeather, WeatherDetails, Forecast)
5. Apply the dynamic background class to the root wrapper div using `getWeatherTheme()` from `lib/getWeatherTheme.ts`
6. Add a loading state using Next.js `loading.tsx` in the app directory

## Key Principle
The API key lives only in server-side code. It is NEVER passed to a client component or exposed in the browser bundle.

## Acceptance Criteria
- `app/page.tsx` has no `"use client"` directive
- Weather data is fetched server-side
- Background class is applied dynamically based on current conditions
- Page renders without console errors

## Reference Files
- references/project-overview.md
- references/file-structure.md
