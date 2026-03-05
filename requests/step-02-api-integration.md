# Step 2 — OpenWeatherMap API Integration

## Task
Create a typed API service layer that fetches current weather and forecast data for Long Beach, CA.

## Instructions
1. Create `lib/weather.ts`
2. Define TypeScript interfaces for:
   - `CurrentWeather` (temp, feels_like, humidity, wind_speed, weather condition, UV index)
   - `ForecastDay` (date, high, low, condition)
   - `WeatherData` (combines current + forecast array)
3. Implement `getCurrentWeather()` — calls OpenWeatherMap Current Weather API for Long Beach (lat: 33.7701, lon: -118.1937)
4. Implement `getForecast()` — calls the 5-day/3-hour forecast API, then reduces it to one entry per day (5 days total)
5. Implement `getUVIndex()` — calls the UV index endpoint using the same coordinates
6. Export a single `getWeatherData()` function that calls all three and returns a combined `WeatherData` object

## API Details
- Base URL: `https://api.openweathermap.org/data/2.5/`
- Units: `imperial` (Fahrenheit)
- API key: read from `process.env.OPENWEATHERMAP_API_KEY`
- Long Beach coordinates: lat=33.7701, lon=-118.1937

## Acceptance Criteria
- All functions are fully typed with no `any`
- API key is never hardcoded
- Errors from the API are thrown with descriptive messages
- `getWeatherData()` returns a single well-typed object

## Reference Files
- references/api-reference.md
- references/project-overview.md
