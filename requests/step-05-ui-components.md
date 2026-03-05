# Step 5 — UI Components

## Task
Build the three display components that render the weather data.

## Instructions

### `components/CurrentWeather.tsx`
- Props: `temp`, `feelsLike`, `condition` (string label), `icon` (OWM icon code), `cityName`
- Display: Large temperature, city name ("Long Beach, CA"), condition label, weather icon
- Icon URL pattern: `https://openweathermap.org/img/wn/{icon}@2x.png`

### `components/WeatherDetails.tsx`
- Props: `humidity`, `windSpeed`, `uvIndex`
- Display: Three stat cards side by side
  - Humidity (%)
  - Wind Speed (mph)
  - UV Index (with low/moderate/high label based on value)
- UV label thresholds: 0-2 = Low, 3-5 = Moderate, 6-7 = High, 8-10 = Very High, 11+ = Extreme

### `components/Forecast.tsx`
- Props: `days` — array of `{ date: string, high: number, low: number, conditionCode: number, icon: string }`
- Display: Horizontal strip of 5 day cards
  - Day name (Mon, Tue, etc.)
  - Weather icon
  - High / Low temps

## Styling Rules
- All components are client components only if they need interactivity — otherwise keep them as server components
- Use Tailwind for all styling
- Cards should have a semi-transparent white background (`bg-white/20 backdrop-blur-sm`) so they layer over the dynamic background
- Text should be dark enough to read on both light and dark backgrounds — use `text-gray-900` or `text-white` with a shadow if needed

## Acceptance Criteria
- All props are fully typed with TypeScript interfaces
- No inline styles — Tailwind only
- Components render without errors when passed valid props

## Reference Files
- references/project-overview.md
- references/tech-stack.md
- references/file-structure.md
