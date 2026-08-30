import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseClient";

/**
 * A learner's cross-device state, stored as one document per user at
 * `learnerState/{uid}` (see firebase/firestore.rules — owner-only).
 *
 * Kept as a single document rather than an `enrollments` collection so a
 * client can sync everything in one read and one write. The collection-based
 * shapes in docs/FIRESTORE_SCHEMA.md remain the target once server-side
 * aggregation (enrollment counts, tutor payouts) actually needs them.
 */
export interface LearnerState {
  enrollments: string[];
  completedLessons: Record<string, string[]>;
  bookings: string[];
}

export const EMPTY_LEARNER_STATE: LearnerState = {
  enrollments: [],
  completedLessons: {},
  bookings: [],
};

export async function fetchLearnerState(uid: string): Promise<LearnerState | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, "learnerState", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<LearnerState>;
  return {
    enrollments: data.enrollments ?? [],
    completedLessons: data.completedLessons ?? {},
    bookings: data.bookings ?? [],
  };
}

export async function saveLearnerState(uid: string, state: LearnerState): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "learnerState", uid), { ...state, updatedAt: new Date().toISOString() }, { merge: true });
}

/**
 * Merges local (offline / signed-out) state into whatever is already in the
 * cloud, so signing in on a new device adds to your history instead of
 * silently wiping either side. Union semantics: progress is only ever gained.
 */
export function mergeLearnerState(local: LearnerState, remote: LearnerState): LearnerState {
  const completedLessons: Record<string, string[]> = { ...remote.completedLessons };
  for (const [courseId, lessons] of Object.entries(local.completedLessons)) {
    completedLessons[courseId] = Array.from(new Set([...(completedLessons[courseId] ?? []), ...lessons]));
  }
  return {
    enrollments: Array.from(new Set([...remote.enrollments, ...local.enrollments])),
    bookings: Array.from(new Set([...remote.bookings, ...local.bookings])),
    completedLessons,
  };
}
