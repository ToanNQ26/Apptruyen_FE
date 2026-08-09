// src/store/auth.store.ts

import { create } from "zustand";
import type { User } from "../models";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  authExpired: boolean;

  setAccessToken: (token: string |null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthExpired: (expired: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // ===== Initial State =====
  accessToken: null,
  user: null,
  loading: true,
  authExpired: false,


  // ===== Actions =====
  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),

  setUser: (user) =>
    set({
      user,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

    setAuthExpired: (expired) =>
        set({
            authExpired: expired,
        }),

  logout: () =>
    set({
        accessToken: null,
        user: null,
        loading: false,
    }),
}));

export const useIsLoggedIn = () =>
  useAuthStore((state) => !!state.user);