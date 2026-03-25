# Workshop App Specification

A real-time social updates feed built with React, Vite, and Supabase.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  React + Vite + TypeScript + Tailwind                       │
├─────────────────────────────────────────────────────────────┤
│                        Backend                               │
│  Supabase (Postgres + Auth + Realtime)                      │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Current
- [x] User authentication (login/register)
- [x] Post updates to feed
- [x] Real-time feed updates via Supabase Realtime
- [x] User profiles

### Planned (for agent demo)
- [ ] Like/reaction system for updates
- [ ] Comment threads on updates
- [ ] User mentions (@username)
- [ ] Image attachments
- [ ] Search functionality

## Database Schema

### profiles
- `id` (uuid, FK to auth.users)
- `username` (text, unique)
- `full_name` (text)
- `avatar_url` (text)
- `created_at` (timestamp)

### updates
- `id` (uuid)
- `user_id` (uuid, FK to profiles)
- `content` (text)
- `created_at` (timestamp)

## Autonomous Agent Demo Tasks

Use these tasks to demonstrate build → test → deploy workflow:

### Task 1: Add Likes Feature
```
Build a like/reaction system:
1. Add 'likes' table (update_id, user_id, created_at)
2. Add like button to UpdateCard component
3. Show like count on each update
4. Write tests for the like functionality
5. Ensure all tests pass before completing
```

### Task 2: Add Comments Feature
```
Build a comment system:
1. Add 'comments' table (id, update_id, user_id, content, created_at)
2. Create CommentForm and CommentList components
3. Add real-time comment updates
4. Write tests for comment functionality
5. Ensure all tests pass before completing
```

### Task 3: Performance Optimization
```
Optimize the feed:
1. Add pagination/infinite scroll
2. Implement virtual scrolling for large feeds
3. Add loading skeletons
4. Profile and fix any performance issues
```

## CI/CD Pipeline

```
Push to main → Lint → Type Check → Test → Build → Deploy
```

All stages must pass for deployment to proceed.

## Environment Variables

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Development

```bash
npm install
npm run dev          # Start dev server
npm test             # Run tests
npm run build        # Production build
npm run lint         # Run linter
```
