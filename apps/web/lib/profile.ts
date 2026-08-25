import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebaseClient";
import type { AgeBracket, UserRole } from "@shared/types";

export interface NewProfileInput {
  role: UserRole;
  ageBracket: AgeBracket;
  guardianEmail?: string;
}

export async function ensureProfile(user: User, input: NewProfileInput) {
  if (!db) return;
  const ref = doc(db, "profiles", user.uid);
  const existing = await getDoc(ref);
  if (existing.exists()) return;

  await setDoc(ref, {
    fullName: user.displayName ?? "PeerScholar user",
    email: user.email,
    photoURL: user.photoURL,
    role: input.role,
    ageBracket: input.ageBracket,
    parentalConsentGiven: input.ageBracket === "18_plus",
    guardianEmail: input.guardianEmail ?? null,
    bio: "",
    isIdVerified: false,
    ratingAvg: 0,
    ratingCount: 0,
    createdAt: serverTimestamp(),
  });
}
