# OnShore Reputation Intelligence

AI-powered online reputation management dashboard for restaurants and hotels.

## What this MVP does

- Accepts a business name, city/location, and optional website
- Simulates review aggregation from multiple public sources
- Classifies reviews into positive, neutral, and negative sentiment
- Extracts topics, emotion, and priority flags
- Generates summaries and suggested responses
- Surfaces urgent reviews and recommendations

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Lucide icons

## Architecture

- `src/app` contains the route and global styles
- `src/components` contains the dashboard UI
- `src/lib/mock-data.ts` simulates multi-source review ingestion
- `src/lib/analysis.ts` handles sentiment split, summaries, response generation, and recommendations
- `src/lib/types.ts` defines the data model

## Mock vs Real Data

This repository uses mock review data and local analysis logic for the MVP. The connector layer is intentionally modular so it can later be replaced with real integrations such as Google reviews, Apify actors, SERP APIs, or other compliant data sources.

## Setup

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

3. Open the app in your browser

## Quick Start

- Install dependencies:

```bash
npm install
```

- Run development server (uses Webpack by default in this repo):

```bash
npm run dev
# or the explicit alias
npm run dev:webpack
```

- Create a production build:

```bash
npm run build
# or the explicit alias
npm run build:webpack
```

- Start the production server (after build):

```bash
npm run start
```

Notes:

- This workspace encountered Turbopack manifest/ENOSPC issues in some environments, so the project is configured to run with Webpack (see `package.json` scripts). If you prefer Turbopack and your environment supports it, remove the `--webpack` flags.
- If Next.js warns about an inferred workspace root (multiple lockfiles), you can either remove the extra lockfile or set `outputFileTracingRoot` in `next.config.mjs`.
- For CI, run `npm ci` then `npm run build` to validate production builds.

## Environment Variables

Copy `.env.example` to `.env.local` and configure any API keys if you later add real AI or data connectors.

## Features Delivered

- Business search/input form
- Dashboard UI with KPIs
- Source-wise breakdown
- Recent reviews list
- Urgent reviews section
- Top complaints and compliments
- AI-style summaries
- Suggested responses
- Recommendations engine

## Future Improvements


## Deploying to Vercel

Recommended: connect this GitHub repository to Vercel for automatic deployments on push.

1. Go to https://vercel.com and sign in with GitHub.
2. Import the repository `heypriyak/OnShore-Labs-Assignment` and follow the project setup.
	 - Framework: Next.js
	 - Build command: `npm run build`
	 - Output directory: (leave blank — Next.js defaults)
3. Add any environment variables via the Vercel dashboard if you add real connectors later.

This repo includes `vercel.json` for a minimal Next.js deployment. If you prefer automated deploys via GitHub Actions, create a secret `VERCEL_TOKEN` and use the official Vercel action.

Example GitHub Action (optional) to deploy on push:

```yaml
name: Deploy to Vercel

on:
	push:
		branches: [ main ]

jobs:
	deploy:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- uses: amondnet/vercel-action@v20
				with:
					vercel-token: ${{ secrets.VERCEL_TOKEN }}
					vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
					vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
					prod: true
```

