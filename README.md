# TeluTalk – Speak Telugu Fast

Learn conversational Telugu in 30 days with bite‑sized, gamified lessons: streaks, XP, and speaking/listening exercises powered by your Supabase content.

## Live app

- **Production**: `https://telutalk.netlify.app/`

## Tech stack

- **Frontend**: Vite, React, TypeScript
- **UI**: Tailwind CSS, shadcn‑ui, Framer Motion, Lucide icons
- **Data & Auth**: Supabase (Postgres, Row Level Security, magic‑link auth)
- **Deployment**: Netlify

## Running locally

**Prerequisites**

- Node.js and npm (recommend installing via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A Supabase project with:
  - `phrases` table containing 30 days of phrases
  - `user_progress` table for per‑user progress

**1. Clone and install**

```sh
git clone https://github.com/AlexBotUpdates/TeluTalk.git
cd TeluTalk
npm install
```

**2. Environment variables**

Create a `.env.local` file in the project root (this file is git‑ignored so your keys stay private):

```sh
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Do **not** commit this file.

**3. Start the dev server**

```sh
npm run dev
```

The app will be available on `http://localhost:8080`.

## Supabase schema (overview)

- **`phrases`**
  - Stores all lesson content.
  - Columns: `id`, `day`, `topic`, `telugu`, `pronunciation`, `english`, `sort_order`.
  - RLS can be disabled or have a public `SELECT` policy (read‑only content).

- **`user_progress`**
  - Stores per‑user XP, streak, completed lessons, and phrases mastered.
  - Columns: `user_id`, `current_day`, `xp`, `streak`, `last_session_date`, `completed_lessons` (int[]), `phrases_mastered`, `updated_at`.
  - RLS **enabled** with policies so each user can only read/write their own row (`auth.uid() = user_id`).

## Netlify deployment notes

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- SPA routing: `public/_redirects` contains:

```txt
/* /index.html 200
```

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview production build locally
- `npm run test` / `npm run test:watch` – run tests
- `npm run phrases:csv` – flatten `phrases.json` into `phrases.csv` for importing into Supabase

