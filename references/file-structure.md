# Planned File Structure

```
Hello-World/
├── app/
│   ├── layout.tsx           # Root layout — sets font, global styles
│   ├── page.tsx             # Server component — fetches data, applies background
│   ├── loading.tsx          # Loading UI shown while page.tsx fetches
│   └── globals.css          # Tailwind base imports only
├── components/
│   ├── CurrentWeather.tsx   # Large temp display, condition, city name, icon
│   ├── WeatherDetails.tsx   # Humidity, wind speed, UV index cards
│   └── Forecast.tsx         # 5-day horizontal forecast strip
├── lib/
│   ├── weather.ts           # API calls + TypeScript interfaces
│   └── getWeatherTheme.ts   # Condition code → Tailwind class string
├── references/              # Project planning docs (not part of app)
├── requests/                # Step-by-step build prompts (not part of app)
├── .env.local               # API key — NEVER commit this file
├── .gitignore               # Must include .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Component Data Flow
```
app/page.tsx (server)
  └── calls getWeatherData() from lib/weather.ts
  └── calls getWeatherTheme() from lib/getWeatherTheme.ts
  └── passes props to:
       ├── CurrentWeather (temp, feelsLike, condition, icon, cityName)
       ├── WeatherDetails (humidity, windSpeed, uvIndex)
       └── Forecast (days[])
```

## Environment Variables
| Variable                    | Location      | Used In         |
|-----------------------------|---------------|-----------------|
| OPENWEATHERMAP_API_KEY      | .env.local    | lib/weather.ts  |

This variable must also be added to Vercel dashboard before deploying.
