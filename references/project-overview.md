# Project Overview

## What We're Building
A weather app hardcoded to **Long Beach, CA** that displays current conditions and a 5-day forecast with a dynamic background that changes based on the weather.

## Goals
- Display current temperature, feels like, humidity, wind speed, UV index, and condition
- Display a 5-day forecast with high/low temps and condition icons
- Background color changes based on current weather:
  - Sunny / Clear → Yellow gradient
  - Rainy / Drizzle / Thunderstorm → Blue gradient
  - Cloudy / Foggy / Overcast → Grey gradient
- Secure API key handling (server-side only)
- Deployed publicly on Vercel

## Long Beach Coordinates
- Latitude: 33.7701
- Longitude: -118.1937
- Country: US
- Units: Imperial (Fahrenheit, mph)

## Decisions Made
- Hardcoded to Long Beach only (no city search)
- No user authentication required
- No database — all data fetched fresh from API on each request
- App Router (not Pages Router)
