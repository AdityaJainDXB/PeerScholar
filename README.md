# PeerScholar

Peer-to-peer tutoring, run by students, for students.

I got the idea from tutoring people in my own community. I'd sit with someone stuck on a topic I'd covered maybe a year before, and it kept being obvious that someone who *just* learned the material explains it better than an adult tutor charging $60/hr does. They still remember exactly which part was confusing, because they were confused by it recently too.

The problem is peer tutoring has zero structure behind it. It's a favour from a friend, or someone in a group chat, and there's no real way to find someone good, no way to actually schedule anything, and definitely no way to pay someone for their time. PeerScholar is my attempt at fixing that. Students teach other students — live over video, or through a recorded course — and the platform takes care of discovery, scheduling, payments, and making sure the quality doesn't slip.

I built this as a student project for my university application, and it's an actual working prototype, not mockups: a website plus native iOS and Android apps, all sharing one Firebase backend, with real Google Sign-In wired up. All the product and business planning is in `docs/`.

## How it works

Learners search for a tutor or a course by subject, then either book a live session or enrol in a recorded one.

Tutors are also just students — high school or university. They list what they can teach, and either run live sessions over video or record a course and upload it.

There's a third role too: QA Reviewer, also a student. They check courses before they go live and spot-check live sessions. This matters more than it sounds like it should — the whole pitch of the platform is "a student teaching you is as good as a paid tutor," and that falls apart the second someone's first course purchase turns out to be bad.

PeerScholar takes a cut of paid sessions and course sales, pays the rest to the tutor, and pays QA reviewers a stipend on top.

If you want more detail: [docs/PRODUCT.md](docs/PRODUCT.md) covers the feature set, [docs/BUSINESS_MODEL.md](docs/BUSINESS_MODEL.md) covers how it makes money, [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) covers how it's built, and [docs/ROADMAP.md](docs/ROADMAP.md) covers what's next.

## Building it

### Why I threw out the first version

I originally built the mobile app in Expo/React Native, then scrapped it and rewrote both apps natively — Swift/SwiftUI for iOS, Kotlin/Compose for Android.

It came down to UI and feel. Expo was fine for laying out screens, but I couldn't get it to feel like a real app. Proper platform navigation, animations that don't stutter, controls that behave the way people already expect on their OS — either Expo didn't give me those out of the box, or I was fighting it the entire time to get close. Rewriting the app twice, once per platform, was genuinely more work than one shared codebase would've been. I still think it was worth it, because the entire point of building a native app instead of just a website is that it should feel native.

### The bug that ate my week

The Expo dev server kept crashing with `EMFILE: too many open files`. Obvious fix: raise the file descriptor limit. So I raised it. Still crashed. I pushed `ulimit -n` up to 1,048,576 — a genuinely ridiculous number — and it *still* crashed.

Turns out it had nothing to do with my process's file descriptor limit at all. macOS has a separate, system-wide cap on vnodes (the kernel's handle for an open file), and mine was sitting completely maxed out — 245,880 out of 245,880. Didn't matter what I set for my own process, there were no handles left anywhere on the machine to hand out. A restart fixed it in about ten seconds.

That one cost me hours because the error message points you at exactly the wrong knob to turn, and the fix that everyone online recommends first doesn't actually do anything.

### Getting it live

Two more bugs, both of which only showed up in production and worked fine locally:

The site deployed to GitHub Pages and every script and stylesheet 404'd. GitHub Pages serves a project site from `/PeerScholar/`, but Next.js was still writing asset paths off `/`. Fixed it by setting `basePath`.

Google Sign-In worked flawlessly on localhost, then broke completely on the live site. Turns out Firebase only allows sign-in from domains you've explicitly allowlisted, and I'd never added the GitHub Pages domain.

## Repo structure

```
PeerScholar/
├── docs/               Product, architecture, business model, roadmap
├── firebase/           Firestore security rules + indexes
├── packages/shared/    TypeScript types & constants shared by the website
└── apps/
    ├── web/            Next.js website (learners, tutors, QA, admin)
    ├── ios/            Native Swift/SwiftUI app (Xcode project via XcodeGen)
    └── android/        Native Kotlin/Jetpack Compose app
```

One Firebase project, one data model (see [docs/FIRESTORE_SCHEMA.md](docs/FIRESTORE_SCHEMA.md)), behind three separate front ends. Worth repeating: these are three real native codebases, not one cross-platform codebase wrapped up three ways.

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Firebase (Auth with Google Sign-In, Firestore, Storage) |
| Website | Next.js 14 (static export) + TypeScript + Tailwind, hosted on GitHub Pages |
| iOS | Native Swift + SwiftUI, Xcode project generated by XcodeGen from `apps/ios/project.yml` |
| Android | Native Kotlin + Jetpack Compose, standard Gradle/Android Studio project |
| Shared code | `packages/shared`, TypeScript types & constants used by the website |
| Payments | Stripe Connect for marketplace payouts — planned, see roadmap |
| Live video | Daily.co or LiveKit — planned, see roadmap |

## Getting started

### 1. Set up a Firebase project

- [Firebase Console](https://console.firebase.google.com) → Add project
- Build → Authentication → Sign-in method → enable Google
- Build → Firestore Database → create a database in production mode, then deploy the rules from this repo:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore --project YOUR_PROJECT_ID --config firebase/firebase.json
```

### 2. Run the website

```bash
cd apps/web
npm install
cp .env.local.example .env.local   # fill in your Firebase web app config
npm run dev
```

Visit `http://localhost:3000`. It ships with mock data and sign-in disabled by default, so you can click through the whole thing without touching Firebase at all.

### 3. Run the iOS app

See [apps/ios/README.md](apps/ios/README.md). Open `PeerScholar.xcodeproj` in Xcode, drop in your `GoogleService-Info.plist`, hit run.

### 4. Run the Android app

See [apps/android/README.md](apps/android/README.md). Open `apps/android` in Android Studio, drop in your `google-services.json`, hit run.

## Where things stand

It's an early MVP. All three clients work today on mock data, with real Google Sign-In once you plug in your own Firebase config. Enrolling in a course, working through lessons, booking a live session — all of that works end to end. Payments and live video are baked into the data model but not wired up to an actual processor yet.

Honestly, the part I'm least happy with is the animation between screens. Each screen individually looks how I wanted, but the transitions between them, the overall flow, still feel stiff — especially on mobile. That's the difference between something that *looks* like an app and something that *feels* like one, and it's the first thing I want to go fix.

[docs/ROADMAP.md](docs/ROADMAP.md) has the rest of what's planned.
