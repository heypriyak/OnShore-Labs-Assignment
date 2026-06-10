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

- Swap mock connectors with real API integrations
- Add multi-business history and saved searches
- Add export to CSV/PDF
- Add authentication and team roles
- Deploy to Vercel
