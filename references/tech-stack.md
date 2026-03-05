# Tech Stack

## Core
| Technology      | Version  | Reason                                                                 |
|-----------------|----------|------------------------------------------------------------------------|
| Next.js         | 15       | App Router, server components, built-in env var support                |
| TypeScript      | 5+       | Type safety for API responses and component props                      |
| Tailwind CSS    | 3+       | Dynamic class-based theming, responsive utilities, fast to build with  |

## API
| Service            | Usage                              | Notes                             |
|--------------------|------------------------------------|-----------------------------------|
| OpenWeatherMap     | Current weather, forecast, UV      | Free tier, key stored in .env.local |

## Deployment
| Service  | Usage       | Notes                                          |
|----------|-------------|------------------------------------------------|
| GitHub   | Source repo | Required for Vercel integration                |
| Vercel   | Hosting     | Free tier, auto-deploy on push, env var support |

## Why Tailwind CSS (not plain CSS modules)
1. Dynamic theming is trivial — swap a class string based on weather condition
2. Responsive layout with `sm:` / `md:` prefixes — no media query files
3. Next.js official recommendation for styling
4. Semi-transparent glass-card effect (`bg-white/20 backdrop-blur-sm`) is one utility class

## Tailwind Critical Rule
NEVER build Tailwind class names dynamically via string interpolation.
Tailwind's purge/JIT compiler only detects static, fully-written class names.

BAD:  `bg-${color}-300`
GOOD: return the full string `"bg-yellow-300"` from a lookup/switch
