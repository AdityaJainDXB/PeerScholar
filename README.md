# PeerScholar

Peer-to-peer tutoring, run by students, for students.

The idea came out of peer tutoring I was already doing in my community. Sitting with people who were stuck on something I'd covered a year earlier, it was obvious that a student who just went through the material is often better at explaining it than an adult tutor charging $60/hr. They remember which part was confusing, because they were confused by it recently.

The problem is that peer tutoring is completely unstructured. It's a friend doing you a favour, or a group chat, and there's no way to find someone good, no way to schedule properly, and no way to pay anyone for their time. PeerScholar is an attempt at putting structure around it. Students teach other students, live over video or through recorded courses, and the platform handles discovery, scheduling, payments and quality checks.

This is a student project I built for my university application. It's a working prototype rather than mockups: a website plus native iOS and Android apps on a shared Firebase backend, with real Google Sign-In. The product and business planning I did is in `docs/`.

## How it works

Learners search for a tutor or course by subject, then either book a live session or enrol in a recorded course.

Tutors are also high school or university students. They list what they can teach and either run live video sessions or record a course and upload it.

There's a third role, QA Reviewer, also filled by students. They review courses before those go live and spot-check live sessions. This part matters more than it sounds. The whole pitch is that a student teaching you is as good as a paid adult tutor, and that falls apart immediately if the first course someone buys is bad.

PeerScholar takes a commission on paid sessions and course sales, and pays the rest out to tutors, plus a stipend to QA reviewers.

More detail: [docs/PRODUCT.md](docs/PRODUCT.md) for the feature set, [docs/BUSINESS_MODEL.md](docs/BUSINESS_MODEL.md) for how it makes money, [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how it's built, [docs/ROADMAP.md](docs/ROADMAP.md) for what's next.

## Building it

### Starting over in native

I built the first version of the mobile app in Expo and React Native, and then threw it away and rewrote both apps natively, in Swift/SwiftUI for iOS and Kotlin/Compose for Android.

The reason was UI and graphics. Expo was fine for putting screens together, but I couldn't get the app to feel like a real app in it. The things I wanted, proper platform navigation, animation that doesn't stutter, controls that behave the way people expect on each OS, either weren't there or fought me the whole way. Rewriting it twice, once per platform, was more work than keeping one codebase. I still think it was the right call, because the whole point of shipping a native app instead of a website is that it feels native.

### The bug that cost me the most time

The Expo dev server kept dying with `EMFILE: too many open files`. The obvious fix is raising the file descriptor limit, so I raised it, and it kept dying. I pushed `ulimit -n` all the way up to 1,048,576, which is an absurd number, and it still kept dying.

It wasn't the file descriptor limit at all. macOS also has a system-wide cap on vnodes, which is the kernel's handle for an open file, and mine was completely maxed out at 245,880 of 245,880. So it didn't matter what I set my own process limit to. The machine had no handles left to give out. Restarting fixed it.

I lost hours to that one because the error message points you straight at the wrong setting, and the fix that everyone online suggests is the fix that doesn't work.

### Getting it deployed

Two more that were educational, both of which only broke in production and worked fine locally:

The site deployed to GitHub Pages and every single script and stylesheet 404'd. GitHub Pages serves a project site from `/PeerScholar/`, but Next.js was writing asset paths from `/`. Fixed by setting `basePath`.

Google Sign-In worked perfectly on localhost and failed on the live site. Firebase only allows sign-in from domains on an allowlist, and I'd never added the GitHub Pages one.

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

One Firebase project and one data model (see [docs/FIRESTORE_SCHEMA.md](docs/FIRESTORE_SCHEMA.md)) behind three separate front ends. As above, these are three real native codebases, not one cross-platform codebase wrapped three ways.

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Firebase (Auth with Google Sign-In, Firestore, Storage) |
| Website | Next.js 14 (static export) + TypeScript + Tailwind, hosted on GitHub Pages |
| iOS | Native Swift + SwiftUI, Xcode project generated by XcodeGen from `apps/ios/project.yml` |
| Android | Native Kotlin + Jetpack Compose, standard Gradle/Android Studio project |
| Shared code | `packages/shared`, TypeScript types & constants used by the website |
| Payments | Stripe Connect for marketplace payouts. Planned, see roadmap |
| Live video | Daily.co or LiveKit. Planned, see roadmap |

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

Visit `http://localhost:3000`. It ships with mock data and sign-in disabled, so you can click through the whole thing without setting up Firebase at all.

### 3. Run the iOS app

See [apps/ios/README.md](apps/ios/README.md). Open `PeerScholar.xcodeproj` in Xcode, add your `GoogleService-Info.plist`, run.

### 4. Run the Android app

See [apps/android/README.md](apps/android/README.md). Open `apps/android` in Android Studio, add your `google-services.json`, run.

## Where things stand

It's an early MVP. All three clients work today, running on mock data, with real Google Sign-In once you add your own Firebase config. Enrolling in a course, working through lessons and booking a live session all work end to end. Payments and live video are designed into the data model but aren't connected to a live processor yet.

The part I'm least happy with is the animation between screens. Individual screens look how I wanted, but the transitions and the overall flow from one to the next still feel stiff, especially on mobile, and that's the difference between something that looks like an app and something that feels like one. It's the first thing I want to go back and fix.

[docs/ROADMAP.md](docs/ROADMAP.md) has the rest of what's planned.
