# Roadmap

## Phase 0 — Scaffold (this repo, current state)
- [x] Product spec, business model, architecture docs
- [x] Firestore schema + security rules covering users, courses, sessions,
      payments, reviews, QA reviews, reports
- [x] Website (Next.js, static export) — landing page, browse, tutor
      profile, course detail/player, student/tutor dashboards, QA review
      queue, auth screens — running on mock data, real Google Sign-In wired
- [x] Native iOS app (Swift/SwiftUI) — same core screens, real Google
      Sign-In wired, builds and runs in the simulator
- [x] Native Android app (Kotlin/Jetpack Compose) — same core screens,
      real Google Sign-In wired (written against current APIs; not yet
      compiled in this environment — no Android SDK available here)
- [x] GitHub Pages deploy workflow for the website

## Phase 1 — Real data, no money yet
- [ ] Wire up a real Firebase project (this repo ships with mock data by
      default — see each app's README for exact setup steps)
- [ ] Real course upload (video file → Firebase Storage) and playback
- [ ] Real session booking against tutor-set availability
- [ ] Ratings/reviews actually write to Firestore
- [ ] QA reviewer rubric review actually gates course publishing

## Phase 2 — Payments & live video
- [ ] Stripe Connect onboarding for tutors (identity + bank account)
- [ ] Checkout flow for sessions and courses; funds held, then released
      per the [business model](BUSINESS_MODEL.md)
- [ ] Embedded live video (Daily.co or LiveKit) for live tutoring sessions
- [ ] QA reviewer can join a live session as a silent observer

## Phase 3 — Trust & safety, growth features
- [ ] School email verification at sign-up
- [ ] Parental consent flow for under-18 accounts
- [ ] ID verification badge for adult tutors
- [ ] Reporting/blocking, admin moderation queue
- [ ] Referral program, badges/gamification
- [ ] Sliding-scale / free-tier pricing option

## Phase 4 — Launch
- [ ] iOS App Store + Google Play submission
- [ ] Production deploy of the website
- [ ] Pilot with one or two schools

This roadmap is intentionally sequenced so nothing that touches real money
or real video ships before the underlying accounts, data model, and QA gate
are solid — money and live video are the highest-risk, highest-liability
parts of the product.
