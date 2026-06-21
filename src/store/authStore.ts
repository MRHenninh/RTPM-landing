import { create } from "zustand";
import type { User } from "firebase/auth";
import { watchAuth } from "../firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  init: () => {
    return watchAuth((user) => set({ user, loading: false }));
  },
}));

/** Convenience selector for the current user's display identity. */
export function currentIdentity(user: User | null) {
  return {
    uid: user?.uid || "anonymous",
    name: user?.displayName || user?.email?.split("@")[0] || "You",
    avatar: user?.photoURL || undefined,
  };
}
