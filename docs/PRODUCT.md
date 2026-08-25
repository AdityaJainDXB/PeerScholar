# Product Spec

## Who it's for

- **Learner** — a high school or university student who wants help with a
  subject, either right now (live) or on their own schedule (recorded course).
- **Peer Tutor** — a high school or university student who's strong in a
  subject and wants to teach it, live or on-demand, and get paid for it.
- **QA Reviewer** — a part-time role, also filled by students, responsible
  for spot-checking live sessions and reviewing course quality before
  courses publish. Effectively PeerScholar's peer-run quality team.
- **Parent/Guardian** — for learners and tutors under 18, needs visibility
  into the account and to grant consent (see Trust & Safety below).

## Core features

### 1. Live tutoring
- Tutors publish availability by subject; learners book a 1:1 or small-group
  (2-6 person) session.
- In-session: video call, screen share, shared whiteboard, text chat.
- Session reminders (email + push) 24h and 15min before start.
- After the session: learner rates the tutor, tutor marks attendance.

### 2. On-demand courses (Udemy-style)
- Tutors record lessons, organize them into a course (sections → lessons),
  add a thumbnail, description, and price.
- A course goes into **pending review** until a QA Reviewer approves it —
  it isn't visible to learners until then.
- Learners enroll, watch at their own pace, and see a progress bar.
- Optional short quiz at the end of a section to check understanding.
- Certificate of completion (PDF) generated when a learner finishes 100%.

### 3. Quality assurance program (peer-run)
- QA Reviewers are students who apply for the role and are vetted (see
  Trust & Safety). They're paid per review (see
  [BUSINESS_MODEL.md](BUSINESS_MODEL.md)).
- **Course review**: rubric-based check (audio/video quality, accuracy,
  pacing, whether it matches its description) before a course can publish.
- **Live session spot-checks**: QA Reviewers can join a sample of live
  sessions (disclosed to both learner and tutor beforehand) to confirm
  sessions are actually happening and are being taught well.
- Reviewers can flag a tutor or course; repeated flags trigger a manual
  admin review and possible suspension.

### 4. Marketplace & payments
- Learner pays PeerScholar at checkout; funds are held until the session
  happens / the learner has course access, then released to the tutor minus
  platform commission.
- Tutors set their own prices within a platform min/max per subject tier.
- Payouts to tutors' bank accounts on a rolling schedule (e.g. weekly).
- Refund flow for cancelled sessions or unresolved quality disputes.

### 5. Discovery & matching
- Search and filter by subject, price, rating, availability, and format
  (live vs. course).
- Subject/skill tags on tutor profiles (e.g. "AP Calculus BC", "Intro Python").
- Ratings & written reviews from learners, visible on tutor/course pages.
- "Suggested for you" based on a learner's past subjects and grade level.

### 6. Trust & safety
- Sign-up with a school (.edu or verified high school) email where possible.
- Tutors 18+: optional ID verification badge shown on their profile.
- Under-18 tutors and learners: a parental consent step is required at
  sign-up before the account can book or list a paid session, and a
  parent/guardian contact is kept on file.
- Live sessions can be recorded (disclosed to both parties) and retained
  for a limited window in case of a safety report.
- In-app reporting/blocking on any profile, session, or course.

### 7. Community & engagement
- Badges for milestones (first course published, 50 sessions taught, etc.).
- Referral program: credit for both sides when a referred friend books.
- Study groups: learners studying the same subject can opt into a group
  chat tied to a course or a series of live sessions.

### 8. Notifications
- Session reminders, new-course-from-followed-tutor alerts, payout
  confirmations, QA review results — via email and mobile push.

### 9. Accessibility & inclusivity
- Auto-generated captions on recorded courses.
- A limited free-tier / sliding-scale pricing option for learners with
  financial need, subsidized by platform commission.

### 10. Analytics dashboards
- **Learner**: progress across enrolled courses, upcoming sessions.
- **Tutor**: earnings, session/course ratings, upcoming bookings.
- **Admin**: platform health — GMV, active tutors, QA pass rate, disputes.

## Out of scope (for now)

Group live classes above 6 people, in-app tutor-to-tutor course
collaboration, and a native desktop app are intentionally left out of the
first version — see [ROADMAP.md](ROADMAP.md).
