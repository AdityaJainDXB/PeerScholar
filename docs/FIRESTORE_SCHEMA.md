# Firestore Data Model

PeerScholar uses Firebase: **Firebase Auth** (Google Sign-In) for accounts,
**Firestore** for data, **Firebase Storage** for videos/avatars, and
**Cloud Functions** (planned, see [ROADMAP.md](ROADMAP.md)) for anything
that must run with trusted server-side logic (payments, payouts).

Security rules enforcing the access patterns below live in
[`firebase/firestore.rules`](../firebase/firestore.rules).

## Collections

### `profiles/{uid}`
One document per user, keyed by their Firebase Auth UID (so it's created
automatically on first Google sign-in).
```
fullName: string
email: string
photoURL: string | null
role: "student" | "tutor" | "qa_reviewer" | "admin"
ageBracket: "under_13" | "13_to_17" | "18_plus"
parentalConsentGiven: boolean
guardianEmail: string | null
bio: string | null
isIdVerified: boolean
ratingAvg: number
ratingCount: number
createdAt: timestamp
```

### `subjects/{subjectId}`
```
name: string
category: string
```

### `courses/{courseId}`
```
tutorId: string          // profiles/{uid}
tutorName: string        // denormalized for list views
subject: string
title: string
description: string
thumbnailUrl: string | null
priceCents: number
status: "draft" | "pending_review" | "published" | "flagged" | "rejected"
lessonCount: number
totalDurationMinutes: number
ratingAvg: number
ratingCount: number
enrollmentCount: number
createdAt: timestamp
```

#### `courses/{courseId}/lessons/{lessonId}` (subcollection)
```
title: string
videoUrl: string | null   // Firebase Storage download URL
durationSeconds: number
position: number
isPreview: boolean
```

### `enrollments/{enrollmentId}`
```
studentId: string
courseId: string
progressPercent: number
enrolledAt: timestamp
```

### `liveSessions/{sessionId}`
```
tutorId: string
tutorName: string
subject: string
title: string
description: string
priceCents: number
scheduledAt: timestamp
durationMinutes: number
maxParticipants: number
bookedCount: number
status: "scheduled" | "completed" | "cancelled" | "flagged"
videoRoomUrl: string | null
```

### `bookings/{bookingId}`
```
sessionId: string
studentId: string
status: "confirmed" | "cancelled" | "completed" | "no_show"
bookedAt: timestamp
```

### `payments/{paymentId}`
Written only by a Cloud Function once Stripe is wired up — never directly
from a client.
```
payerId: string
payeeId: string
type: "course" | "session"
referenceId: string
amountCents: number
platformFeeCents: number
status: "pending" | "held" | "released" | "refunded"
stripePaymentIntentId: string | null
createdAt: timestamp
releasedAt: timestamp | null
```

### `reviews/{reviewId}`
```
reviewerId: string
reviewerName: string
targetType: "tutor" | "course"
targetId: string
rating: number   // 1-5
comment: string
createdAt: timestamp
```

### `qaReviews/{qaReviewId}`
```
qaReviewerId: string
targetType: "course" | "live_session"
targetId: string
targetTitle: string
rubricScore: map<string, number>
passed: boolean
notes: string
reviewedAt: timestamp
```

### `reports/{reportId}`
```
reporterId: string
targetType: "user" | "course" | "live_session"
targetId: string
reason: string
status: "open" | "reviewing" | "resolved" | "dismissed"
createdAt: timestamp
```

## Why Firestore over a relational schema

The previous prototype used Supabase/Postgres. Firestore was chosen for
this iteration because it lets both native mobile apps (Swift on iOS,
Kotlin on Android) and the website share one Google-backed identity system
(Firebase Auth + Sign in with Google) and one real-time database via each
platform's official Firebase SDK, with no custom API server to maintain —
the same reasoning as before, just on Google's stack instead of
Supabase's. See [ARCHITECTURE.md](ARCHITECTURE.md).
