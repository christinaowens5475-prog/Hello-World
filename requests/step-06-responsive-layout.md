# Step 6 — Responsive Layout

## Task
Compose all components into a polished, responsive full-page layout.

## Instructions
1. Update `app/page.tsx` layout wrapper to fill the full viewport height (`min-h-screen`)
2. Apply the dynamic background theme class to this wrapper
3. Arrange components using this layout:

### Mobile (default)
- Stack vertically: CurrentWeather → WeatherDetails → Forecast
- Full-width cards with padding

### Desktop (`md:` breakpoint and above)
- CurrentWeather takes the left column (wider)
- WeatherDetails takes the right column
- Forecast spans full width below both columns

4. Add smooth transition on background: `transition-colors duration-700`
5. Ensure the layout has appropriate padding (`p-6 md:p-12`)
6. Center content with `max-w-4xl mx-auto`

## Acceptance Criteria
- Layout looks correct on mobile (375px) and desktop (1280px)
- Background fills the entire viewport with no white gaps
- No horizontal scroll at any viewport width
- Smooth background color transition

## Reference Files
- references/tech-stack.md
- references/file-structure.md
