import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// `isFirebaseConfigured` lets pages fall back to mock data until a real
// Firebase project is wired up — see README.md "Getting started".
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

const googleProvider = new GoogleAuthProvider();

/**
 * Turns a Firebase auth error into something a person can act on.
 *
 * The most common deployment failure is `auth/unauthorized-domain`: Google
 * refuses sign-in from any origin that isn't listed under Firebase Console →
 * Authentication → Settings → Authorized domains. That reads as a generic
 * "sign-in failed" unless we name it, which sends people hunting through
 * application code for a configuration problem.
 */
export function describeAuthError(e: unknown): string {
  const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code: unknown }).code) : "";
  const host = typeof window !== "undefined" ? window.location.hostname : "this domain";

  switch (code) {
    case "auth/unauthorized-domain":
      return `“${host}” isn’t an authorized domain for this Firebase project. Add it in Firebase Console → Authentication → Settings → Authorized domains, then try again.`;
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Allow popups for this site, or try again — we’ll fall back to a full-page redirect.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled.";
    case "auth/network-request-failed":
      return "Network error reaching Google. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "Google sign-in isn’t enabled for this Firebase project. Enable it under Authentication → Sign-in method.";
    default:
      if (!isFirebaseConfigured) {
        return "Firebase isn’t connected yet — add your project keys to apps/web/.env.local (see README).";
      }
      return code ? `Sign-in failed (${code}). Please try again.` : "Sign-in failed. Please try again.";
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth) {
    throw new Error("Firebase isn't configured yet — add your project keys to .env.local first.");
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (e) {
    const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code: unknown }).code) : "";
    // Popups are unreliable in embedded/in-app browsers and with strict popup
    // blockers. Redirect works in those contexts, so fall back rather than
    // dead-ending the person. (Redirect can't help an unauthorized domain —
    // that has to be fixed in the Firebase Console — so don't mask it.)
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw e;
  }
}

/** Completes a redirect-based sign-in when the page loads after returning from Google. */
export async function completeRedirectSignIn(): Promise<User | null> {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch {
    return null;
  }
}

export async function signOutOfFirebase(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
