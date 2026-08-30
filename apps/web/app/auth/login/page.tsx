"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, describeAuthError } from "@/lib/firebaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    setBusy(true);
    try {
      const user = await signInWithGoogle();
      // A null user means we've handed off to a full-page redirect; the
      // AuthProvider settles it when the browser comes back.
      if (user) router.push("/dashboard/student");
    } catch (e) {
      setError(describeAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
      <p className="mt-2 text-sm text-slate-500">Sign in with the Google account you used to sign up.</p>

      {error && (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-left text-sm text-rose-800">
          {error}
        </p>
      )}

      <button
        onClick={handleSignIn}
        disabled={busy}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Continue with Google"}
      </button>

      <p className="mt-4 text-sm text-slate-500">
        New here? <a href="/auth/signup" className="font-medium text-brand-700 hover:underline">Create an account</a>
      </p>
    </div>
  );
}
