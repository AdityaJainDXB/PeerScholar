"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { signInWithGoogle, signOutOfFirebase, describeAuthError } from "@/lib/firebaseClient";
import { withBasePath } from "@/lib/basePath";
import { useToast } from "@/components/Toast";

const learnerLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/dashboard/student", label: "My Learning" },
];

const teacherLinks = [
  { href: "/dashboard/tutor", label: "Analytics" },
  { href: "/admin/qa", label: "QA Queue" },
];

export default function Navbar() {
  const { user, loading, viewMode, setViewMode } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    setBusy(true);
    try {
      const signedIn = await signInWithGoogle();
      if (signedIn) toast(`Welcome, ${signedIn.displayName?.split(" ")[0] ?? "friend"}!`);
    } catch (e) {
      // Show the real reason (unauthorized domain, popup blocked, provider
      // disabled…) instead of a generic failure that hides a config problem.
      setError(describeAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    await signOutOfFirebase();
    toast("Signed out.", "info");
  }

  const links = viewMode === "teacher" ? teacherLinks : learnerLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src={withBasePath("/logo.png")} alt="PeerScholar" width={36} height={36} className="h-9 w-9 object-contain" priority />
          <span className="hidden text-lg font-bold text-slate-900 sm:inline">PeerScholar</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-1 transition-colors hover:text-brand-700 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-brand-600 after:transition-all after:duration-300 ${
                  active ? "text-brand-700 after:w-full" : "after:w-0"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {!loading && user && (
            <div className="relative flex items-center rounded-full bg-slate-100 p-0.5 text-xs font-semibold">
              <span
                className="absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-out"
                style={{ transform: viewMode === "teacher" ? "translateX(calc(100% + 4px))" : "translateX(0)" }}
              />
              <button
                onClick={() => setViewMode("learner")}
                className={`relative z-10 rounded-full px-3 py-1.5 transition-colors duration-300 ${
                  viewMode === "learner" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Learner
              </button>
              <button
                onClick={() => setViewMode("teacher")}
                className={`relative z-10 rounded-full px-3 py-1.5 transition-colors duration-300 ${
                  viewMode === "teacher" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Teacher
              </button>
            </div>
          )}

          {!loading && user ? (
            <div className="flex items-center gap-2">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt={user.displayName ?? "You"}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              )}
              <span className="hidden text-sm font-medium text-slate-700 lg:inline">
                {user.displayName?.split(" ")[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={busy}
              className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
            >
              <GoogleIcon />
              {busy ? "Signing in…" : "Sign in with Google"}
            </button>
          )}
        </div>
      </div>

      {!loading && user && (
        <nav className="flex items-center gap-5 overflow-x-auto border-t border-slate-100 px-4 py-2 text-sm font-medium text-slate-600 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="shrink-0 transition hover:text-brand-700">
              {l.label}
            </Link>
          ))}
        </nav>
      )}

      {error && (
        <div className="animate-fade-in border-t border-rose-200 bg-rose-50">
          <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3">
            <span aria-hidden="true" className="mt-0.5 text-rose-600">
              ⚠
            </span>
            <p className="flex-1 text-sm text-rose-800">{error}</p>
            <button
              onClick={() => setError(null)}
              aria-label="Dismiss"
              className="shrink-0 rounded px-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.1-5.1l-6.5-5.5c-2 1.5-4.6 2.6-7.6 2.6-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.5 5.5C41.6 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}
