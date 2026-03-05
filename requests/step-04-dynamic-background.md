# Step 4 — Dynamic Background Logic

## Task
Create a utility that maps OpenWeatherMap condition codes to Tailwind background theme classes.

## Instructions
1. Create `lib/getWeatherTheme.ts`
2. Accept an OpenWeatherMap condition code (number) as input
3. Return a Tailwind CSS class string based on the following mapping:

| Condition Code Range | Description       | Background Theme         |
|----------------------|-------------------|--------------------------|
| 200–232              | Thunderstorm      | Blue (dark)              |
| 300–321              | Drizzle           | Blue (medium)            |
| 500–531              | Rain              | Blue (medium-dark)       |
| 600–622              | Snow              | Grey (light)             |
| 700–781              | Atmosphere (fog)  | Grey (medium)            |
| 800                  | Clear / Sunny     | Yellow gradient          |
| 801–804              | Cloudy            | Grey (light to dark)     |

4. Use Tailwind gradient utility classes (e.g., `bg-gradient-to-br from-yellow-300 to-orange-300`)
5. Include a fallback for unknown codes (default to grey)

## Note on Tailwind Purging
Do NOT build class names dynamically with string concatenation (e.g., `bg-${color}-300`).
Tailwind's compiler only detects statically written class names. Always return complete class strings.

## Acceptance Criteria
- Function is fully typed: `(code: number) => string`
- All major condition groups are covered
- Returns complete, static Tailwind class strings
- Fallback case is handled

## Reference Files
- references/tech-stack.md
- references/api-reference.md
