# CheckerX

CheckerX is a modern web platform for checkers training. It is not just an 8x8 board: the product loop is play, save, review, learn, and climb the city leaderboard.

## Who It Is For

CheckerX is built for beginners and club players who want to improve tactical thinking through short games, forced-capture habits, and simple coach feedback.

## What Is Implemented

- Interactive checkers board with legal diagonal moves.
- Mandatory captures, multi-jumps, kings, winner detection, and move history.
- Training bot with Beginner, Club, and Elite levels.
- Supabase auth with player profile, city, XP, rating, coach score, and Elite status.
- Saved games in Supabase with XP and rating updates.
- AI Coach-style review of the latest saved game.
- Learning path with quiz lessons and Supabase lesson progress.
- City leaderboard powered by Supabase profiles.
- Pro Tips library with YouTube searches by skill level.
- Elite Demo monetization flow without real payment collection.
- Responsive layout for desktop and mobile.

## Why It Is Valuable

Most simple checkers sites stop at moving pieces. CheckerX turns each match into training: players get XP, save games, review mistakes, follow lessons, and compare progress by city. This creates retention and gives the prototype startup potential.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Database
- Vercel-ready deployment

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Use the same variables in Vercel project settings.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main Routes

- `/` - product home
- `/play` - real checkers board and bot
- `/learn` - lessons with XP
- `/coach` - saved game review
- `/tips` - pro video advice
- `/rankings` - city leaderboard
- `/pro` - Elite Demo
- `/account` - auth and profile
