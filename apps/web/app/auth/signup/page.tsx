"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, isFirebaseConfigured } from "@/lib/firebaseClient";
import { ensureProfile } from "@/lib/profile";
import type { AgeBracket, UserRole } from "@shared/types";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [isMinor, setIsMinor] = useState(false);
  const [guardianEmail, setGuardianEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setError(null);
    setBusy(true);
    try {
      const user = await signInWithGoogle();
      if (!user) throw new Error("no user");
      const ageBracket: AgeBracket = isMinor ? "13_to_17" : "18_plus";
      await ensureProfile(user, { role, ageBracket, guardianEmail: guardianEmail || undefined });
      router.push(role === "tutor" ? "/dashboard/tutor" : "/dashboard/student");
    } catch (e) {
      setError(
        isFirebaseConfigured
          ? "Sign-in didn't go through — try again."
          : "Firebase isn't connected yet. Add your project keys to apps/web/.env.local (see README) to enable real sign-in."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">
        PeerScholar uses Google Sign-In — no separate password to create.
      </p>

      <div className="mt-6 flex rounded-lg border border-slate-300 p-1 text-sm font-medium">
        {(["student", "tutor"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-1.5 capitalize transition ${
              role === r ? "bg-brand-600 text-white" : "text-slate-600"
            }`}
          >
            {r === "student" ? "I want to learn" : "I want to teach"}
          </button>
        ))}
      </div>

      <label className="mt-5 flex items-start gap-2 text-sm text-slate-600">
        <input type="checkbox" className="mt-1" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} />
        I am under 18 years old
      </label>

      {isMinor && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Because you're under 18, a parent or guardian will need to confirm consent by email
          before you can {role === "tutor" ? "list a paid session or course" : "book a paid session or enroll in a course"}.
          <input
            type="email"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-amber-300 p-2 text-sm"
            placeholder="Parent/guardian email"
          />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <button
        onClick={handleContinue}
        disabled={busy}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Continue with Google"}
      </button>

      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account? <a href="/auth/login" className="font-medium text-brand-700 hover:underline">Log in</a>
      </p>
    </div>
  );
}
