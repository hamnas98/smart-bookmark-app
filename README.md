# Smart Bookmark App

A full-stack bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Live Demo
[https://smart-bookmark-app-xyz.vercel.app](https://smart-bookmark-app-xyz.vercel.app)

## Features
- Google OAuth authentication (Supabase Auth)
- Private bookmarks per user enforced by Row Level Security
- Add, edit, and delete bookmarks
- Realtime updates across browser tabs via Supabase Realtime
- Fully responsive UI with Tailwind CSS

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Supabase (PostgreSQL + Auth + Realtime)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Architecture Decisions

### Why Server Components for initial data fetch?
The dashboard page fetches bookmarks on the server before sending HTML
to the browser. This means users see real content immediately with no
loading spinner. The Client Component (BookmarkList) then takes over
for realtime updates.

### Why Server Actions for mutations?
Server Actions run on the server, so database credentials are never
exposed to the browser. They also work without building a separate
API layer.

### Why cookies for session storage?
HTTP-only cookies cannot be read by JavaScript, protecting against
XSS attacks. The @supabase/ssr package handles cookie management
across Server Components, Client Components, and middleware.

### How bookmark privacy is enforced
Three layers of protection:
1. Middleware redirects unauthenticated users before the page renders
2. Server Components verify the session via getUser() before fetching
3. Row Level Security policies in Postgres ensure users can only
   read and write their own rows — even if application code has a bug

## Problems Faced & Solutions

**Problem:** Realtime updates not firing even though subscription
showed SUBSCRIBED status.

**Solution:** Two fixes were required:
1. The bookmarks table was not added to the supabase_realtime
   publication. Fixed with:
   `alter publication supabase_realtime add table bookmarks;`
2. Replica identity was set to default (d) instead of full (f).
   With default identity, DELETE events arrive with an empty old
   row, so the UI couldn't identify which bookmark to remove. Fixed
   with: `alter table bookmarks replica identity full;`

**Problem:** Adding a bookmark required a page refresh to appear
even with realtime set up.

**Solution:** revalidatePath() in Server Actions was conflicting
with useState(). Next.js would re-render the Server Component and
pass new props, but useState ignores prop changes after first mount.
Removed revalidatePath() and let realtime be the single source of
truth for UI updates.

## Local Development

1. Clone the repo
2. Install dependencies: `npm install`
3. Create `.env.local`:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
4. Run dev server: `npm run dev`

## Database Setup

Run in Supabase SQL Editor:

create table bookmarks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  url         text not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table bookmarks enable row level security;
alter table bookmarks replica identity full;
alter publication supabase_realtime add table bookmarks;

create policy "Users can view own bookmarks"
  on bookmarks for select using ( auth.uid() = user_id );

create policy "Users can insert own bookmarks"
  on bookmarks for insert with check ( auth.uid() = user_id );

create policy "Users can update own bookmarks"
  on bookmarks for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

create policy "Users can delete own bookmarks"
  on bookmarks for delete using ( auth.uid() = user_id );