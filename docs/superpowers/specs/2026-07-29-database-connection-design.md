# Database Connection Design — Streak Tracker

**Date:** 2026-07-29
**Status:** Approved Design

## Overview

Connect the Streak Tracker app to Supabase by replacing localStorage persistence with a proper database layer. The app uses custom admin-managed auth (username + password), not Supabase Auth.

## Schema Changes

### New `users` table (replaces dependency on `auth.users`)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Modified `profiles` table

Change `id UUID PRIMARY KEY REFERENCES auth.users(id)` to `id UUID PRIMARY KEY REFERENCES users(id)`.

### Removed

- `handle_new_user()` function (no longer needed)
- `on_auth_user_created` trigger (no longer needed)

### Unchanged

All other tables (questions, daily_answers, daily_completion, streaks, achievements, badges, xp_history, notifications, settings, journal, analytics, friends, leaderboards) — they already reference `profiles(id)` which stays the same.

## Supabase Client Setup

Three files in `src/lib/supabase/`:

### `client.ts` — Browser client
- Uses `@supabase/ssr` `createBrowserClient`
- Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Singleton instance, exported for use in client components

### `server.ts` — Server client
- Uses `@supabase/ssr` `createServerClient`
- Reads cookies for session management
- Used in API routes

### `service.ts` — Data service layer
Organized by domain, each function takes a Supabase client instance:

| Service | Functions |
|---------|-----------|
| `userService` | `create()`, `getById()`, `getByUsername()`, `verifyPassword()`, `list()`, `update()`, `delete()` |
| `profileService` | `get()`, `update()` |
| `habitService` | `list()`, `create()`, `update()`, `delete()` |
| `dailyAnswerService` | `getByDate()`, `bulkCreate()`, `getRange()` |
| `dailyCompletionService` | `getByDate()`, `upsert()`, `getRange()` |
| `streakService` | `get()`, `update()` |
| `achievementService` | `list()`, `create()` |
| `badgeService` | `list()`, `create()` |
| `xpHistoryService` | `list()`, `add()` |
| `notificationService` | `list()`, `create()`, `markRead()`, `markAllRead()` |
| `settingsService` | `get()`, `update()` |
| `journalService` | `getByDate()`, `upsert()` |
| `analyticsService` | `get()`, `upsert()` |
| `friendService` | `list()`, `add()`, `updateStatus()`, `remove()` |
| `leaderboardService` | `getByPeriod()`, `upsert()` |

## StreakContext Integration

### Data flow change

**Before:** User action → Context state → localStorage
**After:** User action → Context state → Service layer → Supabase

### Specific changes in `StreakContext.tsx`

| Operation | Current | New |
|-----------|---------|-----|
| `loginWithCredentials()` | Checks in-memory array | Calls `userService.verifyPassword()` via API |
| `createManagedUser()` | Pushes to array + localStorage | Calls API route → inserts `users` + `profiles` + `settings` + `streaks` |
| `updateManagedUser()` | Updates array + localStorage | Calls `userService.update()` |
| `deleteManagedUser()` | Filters array + localStorage | Calls `userService.delete()` |
| `submitDailyCheckIn()` | Saves to localStorage | Calls `dailyAnswerService.bulkCreate()` + `dailyCompletionService.upsert()` + `streakService.update()` + `xpHistoryService.add()` |
| `addNewHabit()` | Saves to localStorage | Calls `habitService.create()` |
| `updateHabit()` | Saves to localStorage | Calls `habitService.update()` |
| `deleteHabit()` | Saves to localStorage | Calls `habitService.delete()` |
| On mount | Loads from localStorage | Loads from Supabase via service layer |

### New state additions
- `loading: boolean` — true while fetching data from Supabase
- `error: string | null` — error message from failed operations

## Password Handling & API Routes

### Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/login` | POST | Verify username + password, return user + profile data |
| `/api/auth/create-user` | POST | Admin-only: create user with hashed password + profile + settings + streaks |

### Password flow
1. Admin creates user → API route hashes password with `bcryptjs` → stores hash in `users` table
2. User logs in → API route verifies password against hash → returns user data
3. Passwords never stored in plain text

### Dependency added
- `bcryptjs` — lightweight pure-JS bcrypt implementation for password hashing

## Migration Strategy

1. Update the migration SQL with schema changes
2. Run migration against Supabase project (via Supabase CLI or SQL editor)
3. Build Supabase client files
4. Build service layer
5. Update StreakContext to use service layer
6. Create API routes for auth
7. Test end-to-end: admin creates user → user logs in → user checks in → data persists in Supabase