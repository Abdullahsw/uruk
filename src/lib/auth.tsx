import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const setInitialUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Create a mock session
          setSession({
            access_token: "mock-token",
            refresh_token: "mock-refresh-token",
            expires_at: Date.now() + 3600000, // 1 hour from now
            user: parsedUser,
          });
        }
      } catch (error) {
        console.error("Error getting user from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setInitialUser();

    // Add event listener for storage changes (for multi-tab support)
    const handleStorageChange = (event) => {
      if (event.key === "user") {
        if (event.newValue) {
          const parsedUser = JSON.parse(event.newValue);
          setUser(parsedUser);
          setSession({
            access_token: "mock-token",
            refresh_token: "mock-refresh-token",
            expires_at: Date.now() + 3600000,
            user: parsedUser,
          });
        } else {
          setUser(null);
          setSession(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const signOut = async () => {
    try {
      // Remove user from localStorage
      localStorage.removeItem("user");
      // Reset state
      setUser(null);
      setSession(null);
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
