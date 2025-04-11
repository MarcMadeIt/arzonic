import { create } from "zustand";

// Definér typen for brugerens data
interface User {
  id: string;
  email: string | undefined;
}

// Definér Zustand state
interface AuthState {
  user: User | null; // Brugerens data
  role: "admin" | "editor" | null; // Brugerens rolle
  setUser: (user: User) => void; // Sæt brugerdata
  setRole: (role: "admin" | "editor") => void; // Sæt brugerrolle
  clearSession: () => void; // Ryd session
}

// Opret Zustand-store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  clearSession: () => set({ user: null, role: null }),
}));
