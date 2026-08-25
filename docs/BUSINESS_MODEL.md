# Business Model

## Revenue: marketplace commission

PeerScholar is a two-sided marketplace. It doesn't charge for sign-up or
listing — it takes a **commission on every paid transaction**:

| Transaction type      | Suggested commission | Notes |
|------------------------|----------------------|-------|
| Live tutoring session  | 18%                  | Held until the session completes, then released to the tutor minus commission |
| Course sale            | 15%                  | Released to the tutor once the learner's refund window (e.g. 7 days) closes |

These rates are placeholders — real numbers should be validated against
comparable platforms (Wyzant charges ~25%+ decreasing with volume; Udemy
takes ~50-63% on marketplace-driven course sales but only ~3% when the
instructor drives the sale directly). PeerScholar's lower rate is the pitch:
because tutors *are* the target learner base already on the platform, less
paid acquisition is needed, so more of the price can go to the tutor.

## Where the commission goes

1. **QA reviewer pay** — a per-review stipend for the students who check
   course quality and spot-check live sessions.
2. **Payment processing fees** — passed through from Stripe.
3. **Infrastructure** — hosting, database, video, storage.
4. **Trust & safety operations** — ID verification checks, dispute handling.
5. **Platform margin.**

## Payment flow

1. Learner pays at checkout (card, via Stripe).
2. Funds are held by PeerScholar (via Stripe Connect's marketplace/escrow
   pattern) rather than paid out immediately.
3. For a **live session**: funds release to the tutor once the session is
   marked complete by both parties (or automatically 24h after, if
   undisputed).
4. For a **course**: funds release to the tutor once the learner's refund
   window closes without a refund request.
5. Tutors are paid out from their PeerScholar balance to their linked bank
   account on a rolling weekly schedule (standard Stripe Connect payout).

## Future monetization (not in v1)

- **Learner subscription** — flat monthly fee for unlimited access to
  on-demand courses (courses-only, doesn't include live sessions).
- **Featured placement** — tutors can pay to be featured in a subject's
  search results (kept clearly labeled as sponsored, so it doesn't erode
  trust in ratings).
- **School/institution partnerships** — a school licenses PeerScholar as a
  white-labeled peer-tutoring program for its own students, paying a flat
  institutional fee instead of per-transaction commission.

## Why students specifically

Framing tutors *and* QA reviewers as part-time, paid, resume-relevant roles
for students is itself part of the business model — it keeps acquisition
cost low (tutors recruit their own students; QA reviewers are recruited from
the existing tutor pool) and keeps the whole loop peer-run, which is also
the differentiator against adult-tutor marketplaces.
