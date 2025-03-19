import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
import { checkSupabaseConnection } from "./supabaseHelpers";
import { loginUser, registerUser } from "./auth/userOperations";

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
  signUp: (
    email: string,
    password: string,
    userData: any,
  ) => Promise<{ success: boolean; error?: string | null }>;
  isSupabaseConnected: boolean;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signOut: async () => {},
  signIn: async () => ({ success: false, error: null }),
  signUp: async () => ({ success: false, error: null }),
  isSupabaseConnected: false,
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Check Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkSupabaseConnection();
      setIsSupabaseConnected(connected);
    };

    checkConnection();
  }, []);

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      if (isSupabaseConnected) {
        const { data, error } = await supabase.auth.getUser();
        if (!error && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  useEffect(() => {
    // Try to get session from Supabase first
    const initializeAuth = async () => {
      try {
        if (isSupabaseConnected) {
          // Try to get session from Supabase
          const { data, error } = await supabase.auth.getSession();

          if (!error && data.session) {
            setSession(data.session);
            setUser(data.session.user);
            setIsLoading(false);
            return;
          }
        }

        // Fallback to localStorage if Supabase is not connected or no session found
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Create a mock session
          setSession({
            access_token: "mock-token",
            refresh_token: "mock-refresh-token",
            expires_at: Date.now() + 3600000, // 1 hour from now
            expires_in: 3600,
            token_type: "bearer",
            user: parsedUser,
          } as Session);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up Supabase auth listener if connected
    let subscription: { unsubscribe: () => void } | null = null;

    if (isSupabaseConnected) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Update localStorage for fallback
        if (session?.user) {
          localStorage.setItem("user", JSON.stringify(session.user));
        } else {
          localStorage.removeItem("user");
        }
      });

      subscription = data.subscription;
    }

    // Add event listener for storage changes (for multi-tab support)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        if (event.newValue) {
          const parsedUser = JSON.parse(event.newValue);
          setUser(parsedUser);
          setSession({
            access_token: "mock-token",
            refresh_token: "mock-refresh-token",
            expires_at: Date.now() + 3600000,
            expires_in: 3600,
            token_type: "bearer",
            user: parsedUser,
          } as Session);
        } else {
          setUser(null);
          setSession(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isSupabaseConnected]);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    error?: string | null;
    redirectPath?: string;
  }> => {
    try {
      if (isSupabaseConnected) {
        // Use the loginUser function from userOperations
        const { success, error, user, session, redirectPath } = await loginUser(
          email,
          password,
        );

        if (!success) {
          return { success: false, error: error || "Invalid credentials" };
        }

        return { success: true, redirectPath };
      } else {
        // Fallback for demo mode
        // For admin credentials demo
        if (email === "admin@shophub.com" && password === "Admin123!") {
          // Set user in localStorage
          const userData: any = {
            id: "admin-user-id",
            email: email,
            user_metadata: {
              name: "Admin User",
              account_type: "admin",
            },
            created_at: new Date().toISOString(),
          };

          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
          setSession({
            access_token: "mock-token",
            refresh_token: "mock-refresh-token",
            expires_at: Date.now() + 3600000,
            expires_in: 3600,
            token_type: "bearer",
            user: userData,
          } as Session);

          return { success: true, redirectPath: "/dashboard/admin" };
        }

        // Create mock user based on email pattern for demo
        let accountType = "customer";

        if (email.includes("admin")) {
          accountType = "admin";
        } else if (
          email.includes("reseller") ||
          email.includes("distributor")
        ) {
          accountType = "reseller";
        }

        const userData: any = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: {
            name: email.split("@")[0],
            account_type: accountType,
          },
          created_at: new Date().toISOString(),
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setSession({
          access_token: "mock-token",
          refresh_token: "mock-refresh-token",
          expires_at: Date.now() + 3600000,
          expires_in: 3600,
          token_type: "bearer",
          user: userData,
        } as Session);

        let redirectPath = "/dashboard/user";
        if (accountType === "admin") {
          redirectPath = "/dashboard/admin";
        } else if (accountType === "reseller") {
          redirectPath = "/dashboard/reseller";
        }

        return { success: true, redirectPath };
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: any,
  ): Promise<{ success: boolean; error?: string | null }> => {
    try {
      if (isSupabaseConnected) {
        // Use the registerUser function from userOperations
        const { success, error, user, session } = await registerUser(
          email,
          password,
          {
            name: userData.name || email.split("@")[0],
            username: userData.username,
            account_type: userData.account_type || "customer",
            reseller_plan: userData.reseller_plan,
          },
        );

        if (!success) {
          return { success: false, error: error || "Registration failed" };
        }

        return { success: true };
      } else {
        // Fallback for demo mode
        const mockUser: any = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: userData,
          created_at: new Date().toISOString(),
        };

        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({
          access_token: "mock-token",
          refresh_token: "mock-refresh-token",
          expires_at: Date.now() + 3600000,
          expires_in: 3600,
          token_type: "bearer",
          user: mockUser,
        } as Session);

        return { success: true };
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConnected) {
        // Sign out from Supabase
        await supabase.auth.signOut();
      }

      // Always remove from localStorage and reset state
      localStorage.removeItem("user");
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
    signIn,
    signUp,
    isSupabaseConnected,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
