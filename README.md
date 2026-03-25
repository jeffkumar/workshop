# Team Updates App

A simple team updates application where team members can post and share updates.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Local Development**: Supabase CLI with Docker

## Prerequisites

- Node.js 20+
- Docker Desktop
- Supabase CLI (`brew install supabase/tap/supabase`)

## Getting Started

### 1. Start Supabase locally

```bash
supabase start
```

This will start all Supabase services in Docker containers:
- PostgreSQL on localhost:54322
- Supabase Studio (admin UI) on http://localhost:54323
- Auth API on localhost:54321

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Visit http://localhost:5173 to use the app.

## Features

- User registration and login
- Post text updates
- Edit and delete your own updates
- View feed of all team updates
- Real-time updates via Supabase subscriptions

## Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── context/         # Auth context provider
│   ├── lib/             # Supabase client
│   └── pages/           # Page components
├── supabase/
│   └── migrations/      # Database migrations
└── .env.local           # Environment variables
```

## Stopping Supabase

```bash
supabase stop
```

## Future Enhancements

- Video updates support
- Mobile app via Capacitor
- Team/organization features
