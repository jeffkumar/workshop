# Cloud Agent Starter Skill: Run & Test This Codebase

Use this as the default playbook when you first enter the repo. Keep it practical and fast.

## 0) Quick setup (always do first)

### Prerequisites
- Node.js 20+
- Docker running
- Supabase CLI installed (`supabase --version`)

### Boot sequence
1. Install deps:
   - `npm install`
2. Start local backend stack:
   - `supabase start`
3. Confirm env vars exist in `.env.local`:
   - `VITE_SUPABASE_URL=http://127.0.0.1:54321`
   - `VITE_SUPABASE_ANON_KEY=...`
4. Start frontend:
   - `npm run dev`
5. Open app:
   - `http://localhost:5173`

### Fast health checks
- Lint: `npm run lint`
- Unit tests: `npm test`
- Build: `npm run build`

### Known current lint baseline (important for PRs)
- Run `npm run lint` early so CI behavior is predictable.
- Current repo baseline (today) includes:
  - error: `src/App.tsx` → `'ProtectedRoute' is defined but never used` (`@typescript-eslint/no-unused-vars`)
  - warning: `src/context/AuthContext.tsx` → `react-refresh/only-export-components`
- If your PR does not change these paths, call out that lint failure is pre-existing in your PR notes.

---

## 1) Auth area (`src/context`, `src/pages/Login.tsx`, `src/pages/Register.tsx`)

### What to run
- Backend required: `supabase start`
- Frontend required: `npm run dev`

### Login / signup workflow (manual)
1. Open `/register`
2. Create a user (email + password + username + full name)
3. Verify redirect to `/` after success
4. Sign out
5. Open `/login` and sign in with same credentials
6. Verify redirect back to `/`

### Common auth test loop
- Run: `npm test` (mocked supabase tests)
- Then manually verify signup/signin once in browser (real local Supabase)

### Debug tips
- If auth fails unexpectedly, reset local DB and retry:
  - `supabase db reset`
- If redirect behavior looks wrong, check `App.tsx` route guards (`ProtectedRoute` / `PublicRoute`).

---

## 2) Feed + update CRUD area (`src/pages/Feed.tsx`, `src/components/UpdateForm.tsx`, `src/components/UpdateCard.tsx`)

### What to run
- Backend required: `supabase start`
- Frontend required: `npm run dev`

### Core manual workflow
1. Log in
2. Create a new update in “Share an Update”
3. Confirm it appears in “Team Updates”
4. Edit your update and confirm `(edited)` appears
5. Delete your update and confirm it disappears

### Realtime check workflow
1. Keep tab A logged in on `/`
2. Open tab B, log in as same or different user
3. Post/edit/delete in tab B
4. Confirm tab A refreshes feed automatically (subscription path)

### High-signal checks for this area
- `npm test`
- `npm run lint`
- Manual CRUD + realtime flow above

---

## 3) Supabase schema + local backend area (`supabase/migrations`, `supabase/config.toml`)

### When you touch SQL or policies
1. Ensure local stack is running:
   - `supabase start`
2. Reset DB to replay migrations cleanly:
   - `supabase db reset`
3. Verify app behavior through UI (`npm run dev` + browser):
   - signup works (profile trigger path)
   - feed read works
   - create/update/delete respects ownership rules

### Ownership/RLS sanity checks
- User A can edit/delete their own update.
- User B cannot edit/delete User A update.

---

## 4) Feature flags / mocks guidance (current state)

### Current repo state
- No formal feature-flag system exists yet.
- App runtime reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Unit tests mock Supabase calls directly (`vi.mock('./lib/supabase', ...)` in `src/App.test.tsx`).

### How to proceed today
- For UI-only behavior changes, keep using Vitest mocks in test files.
- For backend behavior checks, run against local Supabase (`supabase start`) instead of inventing ad-hoc runtime flags.
- If you introduce a new flag in future work, document it immediately in this skill under this section.

---

## 5) “First 10 minutes” default workflow for Cloud agents

1. `npm install`
2. `supabase start`
3. `npm run dev`
4. `npm test`
5. `npm run lint`
6. Perform one manual auth + one manual CRUD feed pass

If any step fails, capture exact command output and fix root cause before coding.

---

## 6) Keep this skill updated (lightweight runbook process)

Update this file whenever you learn a new reliable testing trick, setup shortcut, or failure recovery step.

For every update:
1. Add the note under the relevant area above.
2. Keep instructions command-first and reproducible.
3. Prefer removing stale guidance over adding long prose.
4. Include the smallest workflow that proves behavior end-to-end.

Good updates are short, specific, and immediately executable by the next Cloud agent.
