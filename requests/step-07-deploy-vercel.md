# Step 7 — Deploy to Vercel

## Task
Push the project to GitHub and deploy to Vercel with the API key set as an environment variable.

## Instructions

### 1. Prepare the repo
- Confirm `.env.local` is NOT committed (check `.gitignore`)
- Run `npm run build` locally to catch any TypeScript or build errors before pushing
- Fix any errors, then commit all changes

### 2. Push to GitHub
- Create a new GitHub repository (public or private — your choice)
- Push the local repo to GitHub

### 3. Deploy on Vercel
- Go to vercel.com and log in (or sign up with your GitHub account)
- Click "Add New Project"
- Import the GitHub repository
- In the "Environment Variables" section before deploying, add:
  - Name: `OPENWEATHERMAP_API_KEY`
  - Value: your actual API key from openweathermap.org
- Click Deploy

### 4. Verify
- Visit the generated Vercel URL
- Confirm weather data loads correctly
- Confirm background color matches current Long Beach conditions

## Important Notes
- NEVER commit `.env.local` or any file containing your real API key
- If the build fails on Vercel, check the build logs — most common cause is a missing environment variable
- Vercel automatically redeploys when you push new commits to the main branch

## Acceptance Criteria
- App is live at a public Vercel URL
- Weather data loads correctly in production
- No API key is visible in the browser or source code
- Build completes with zero errors and zero TypeScript errors

## Reference Files
- references/project-overview.md
- references/tech-stack.md
