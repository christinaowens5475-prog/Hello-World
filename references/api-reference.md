# OpenWeatherMap API Reference

## Authentication
- All requests require `appid={API_KEY}` as a query parameter
- Key is stored in `.env.local` as `OPENWEATHERMAP_API_KEY`
- Key is only accessed in server-side code (`lib/weather.ts`)

## Endpoints Used

### Current Weather
```
GET https://api.openweathermap.org/data/2.5/weather
  ?lat=33.7701
  &lon=-118.1937
  &units=imperial
  &appid={API_KEY}
```
Key response fields:
- `main.temp` — current temperature (°F)
- `main.feels_like` — feels like temperature (°F)
- `main.humidity` — humidity (%)
- `wind.speed` — wind speed (mph)
- `weather[0].id` — condition code (used for background theming)
- `weather[0].description` — human-readable condition
- `weather[0].icon` — icon code for image URL

### 5-Day / 3-Hour Forecast
```
GET https://api.openweathermap.org/data/2.5/forecast
  ?lat=33.7701
  &lon=-118.1937
  &units=imperial
  &appid={API_KEY}
```
Key response fields:
- `list` — array of 40 entries (5 days x 8 per day, every 3 hours)
- Each entry: `dt_txt`, `main.temp_max`, `main.temp_min`, `weather[0].icon`, `weather[0].id`
- Reduce to 1 entry per day by grouping on the date portion of `dt_txt`

### UV Index
```
GET https://api.openweathermap.org/data/2.5/uvi
  ?lat=33.7701
  &lon=-118.1937
  &appid={API_KEY}
```
Key response fields:
- `value` — UV index (number)

## Weather Icon URL Pattern
```
https://openweathermap.org/img/wn/{icon}@2x.png
```
Example: `https://openweathermap.org/img/wn/01d@2x.png`

## Condition Code Groups
| Range   | Category       |
|---------|----------------|
| 2xx     | Thunderstorm   |
| 3xx     | Drizzle        |
| 5xx     | Rain           |
| 6xx     | Snow           |
| 7xx     | Atmosphere/Fog |
| 800     | Clear/Sunny    |
| 80x     | Clouds         |

## Free Tier Limits
- 60 calls/minute
- 1,000,000 calls/month
- All three endpoints used in this project are included in the free tier
- New API keys take up to 2 hours to activate
