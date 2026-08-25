# PeerScholar

**Peer-to-peer tutoring, run by students, for students.**

PeerScholar is a marketplace where high school and university students teach
each other — either live (1:1 or small-group video tutoring) or on-demand
(Udemy-style recorded courses). PeerScholar handles discovery, scheduling,
payments/payouts, and quality assurance, so tutors focus on teaching and
learners focus on learning.

This repo is a student project built as part of a university application. It
contains a working prototype (website + mobile app) on a shared backend, plus
the product/business planning behind it.

## The idea, in short

- **Learners** search for a tutor or course by subject, book a live session or
  enroll in a recorded course, and pay through the platform.
- **Tutors** (high school / university students) list what they can teach,
  run live sessions over video, or record and upload courses.
- **QA Reviewers** — a part-time role also filled by students — spot-check
  live sessions for quality and review uploaded courses before they go live,
  so learners can trust what they're paying for.
- **PeerScholar** takes a small commission on every paid session or course
  sale, and pays out the rest to tutors (and a stipend to QA reviewers).

See [docs/PRODUCT.md](docs/PRODUCT.md) for the full feature set,
[docs/BUSINESS_MODEL.md](docs/BUSINESS_MODEL.md) for how it makes money,
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how it's built, and
[docs/ROADMAP.md](docs/ROADMAP.md) for what's next.

## Repo structure

```
PeerScholar/
├── docs/                  Product, architecture, business model, roadmap
├── supabase/              Database schema (Postgres) + seed data
├── packages/shared/       TypeScript types & constants shared by web + mobile
└── apps/
    ├── web/                Next.js website (learners, tutors, QA, admin)
    └── mobile/             Expo (React Native) app for iOS + Android
```

One database (Supabase/Postgres), one set of shared types, three
front ends: website, iOS app, Android app.

## Tech stack

| Layer          | Choice                                             |
|----------------|-----------------------------------------------------|
| Database/Auth  | [Supabase](https://supabase.com) (Postgres, Auth, Storage, Realtime) |
| Website        | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Mobile app     | Expo (React Native) + TypeScript — one codebase for iOS & Android |
| Shared code    | `packages/shared` — types & constants used by both front ends |
| Payments       | Stripe Connect (marketplace payouts) — *planned, see roadmap* |
| Live video     | Daily.co or LiveKit embeddable video SDK — *planned, see roadmap* |

Supabase was chosen over a hand-rolled backend so most of the effort goes
into product features rather than re-building auth/database plumbing —
but it's still a real Postgres database with a real schema
(see [supabase/schema.sql](supabase/schema.sql)).

## Getting started

### 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql), then
   optionally [`supabase/seed.sql`](supabase/seed.sql) for sample data.
3. Copy your project URL and anon key — you'll need them below.

### 2. Run the website

```bash
cd apps/web
npm install
cp .env.local.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

Visit `http://localhost:3000`. The site runs on mock data out of the box even
without Supabase configured, so you can preview it immediately.

### 3. Run the mobile app

```bash
cd apps/mobile
npm install
cp .env.example .env               # fill in your Supabase URL + anon key
npx expo start
```

Scan the QR code with the Expo Go app on your phone (iOS or Android), or
press `i` / `a` to launch an iOS Simulator / Android Emulator.

## Status

This is an early-stage student project: the UI, data model, and core flows
are scaffolded and runnable with mock data; real payments and live video are
designed but not yet wired to a live payment processor (see
[docs/ROADMAP.md](docs/ROADMAP.md)).
