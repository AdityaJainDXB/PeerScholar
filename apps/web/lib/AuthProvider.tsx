"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuthState, completeRedirectSignIn } from "./firebaseClient";

export type ViewMode = "learner" | "teacher";

interface AuthState {
  user: User | null;
  loading: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  viewMode: "learner",
  setViewMode: () => {},
});

const VIEW_MODE_KEY = "peerscholar:viewMode";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewModeState] = useState<ViewMode>("learner");

  useEffect(() => {
    // If we're returning from a redirect-based sign-in, settle it before the
    // listener reports a signed-out state.
    void completeRedirectSignIn();
    const unsubscribe = subscribeToAuthState((u) => {
      setUser(u);
      setLoading(false);
    });
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(VIEW_MODE_KEY) : null;
    if (stored === "learner" || stored === "teacher") setViewModeState(stored);
    return unsubscribe;
  }, []);

  function setViewMode(mode: ViewMode) {
    setViewModeState(mode);
    if (typeof window !== "undefined") window.localStorage.setItem(VIEW_MODE_KEY, mode);
  }

  return (
    <AuthContext.Provider value={{ user, loading, viewMode, setViewMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
