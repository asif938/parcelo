import { create } from "zustand";

import type { AppRole } from "@/components/layout/nav-config";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  phone?: string | null;
  isActive?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
