import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    error?: string | null;
    redirectPath?: string;
  }>;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
  signIn: async () => ({ success: false, error: null }),
});

export const useAuth = () => useContext(AuthContext);

// Re-export from auth.tsx
export { AuthProvider } from "./auth.tsx";
