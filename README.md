# Valentine's Card

Create a valentine's card with a twist — the "No" button is impossible to click.

<p align="center">
  <a href="https://valentine-card-app-psi.vercel.app">
    <img src="https://img.shields.io/badge/Try%20It%20Out-Live%20Demo-c45c5c?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

---

## How It Works

1. **Write a message** — Create a heartfelt card for someone special
2. **Add a photo** (optional) — Revealed when they say yes
3. **Share the link** — Send it to your valentine
4. **They open it** — Beautiful envelope animation reveals your message
5. **They try to click No** — The button shrinks and runs away
6. **They click Yes** — Because there's no other option

## Features

- Clean, minimal design
- Step-by-step card creation
- Skippable onboarding demo
- Envelope opening animation
- Typewriter text effect
- Escaping "No" button (impossible to click!)
- Optional surprise photo reveal
- Response tracking

## Tech Stack

- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Hosting**: Vercel

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Soojin-Lee0819/valentine-card.git
cd valentine-card
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com) and run this SQL:

```sql
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  response TEXT CHECK (response IN ('yes', 'no')),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON cards FOR ALL USING (true);
```

Create a public storage bucket named `images` for photo uploads.

### 3. Configure environment

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 4. Run locally

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000)

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Soojin-Lee0819/valentine-card)

---

Made for Valentine's Day
