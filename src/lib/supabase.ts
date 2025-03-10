import { createClient } from "@supabase/supabase-js";

// Use environment variables if available, otherwise use mock values for development
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWt0c2Fub3ZqeXRicmZ2c2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NzI5NzcsImV4cCI6MjAxNTU0ODk3N30.mock-key";

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock auth functions for development if no real Supabase connection
if (supabaseUrl === "https://example.supabase.co") {
  console.warn(
    "Using mock Supabase client. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for a real connection.",
  );

  // Mock the auth methods to prevent "Failed to fetch" errors
  const mockUsers = [
    {
      id: "admin-user-id",
      email: "admin@shophub.com",
      password: "Admin123!",
      user_metadata: {
        name: "Admin User",
        account_type: "admin",
      },
      created_at: new Date().toISOString(),
    },
    {
      id: "customer-user-id",
      email: "customer@example.com",
      password: "password123",
      user_metadata: {
        name: "Test Customer",
        account_type: "customer",
        subscription_plan: "free",
      },
      created_at: new Date().toISOString(),
    },
  ];

  // Override auth methods with mock implementations
  supabase.auth.signInWithPassword = async ({ email, password }) => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      return {
        data: { user, session: { access_token: "mock-token" } },
        error: null,
      };
    } else {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" },
      };
    }
  };

  supabase.auth.signUp = async ({ email, password, options }) => {
    // Check if user already exists
    if (mockUsers.some((u) => u.email === email)) {
      return {
        data: { user: null },
        error: { message: "User already registered" },
      };
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      user_metadata: options?.data || {},
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return {
      data: { user: newUser, session: null },
      error: null,
    };
  };

  supabase.auth.getSession = async () => {
    return {
      data: { session: null },
      error: null,
    };
  };

  supabase.auth.onAuthStateChange = () => {
    return {
      data: { subscription: { unsubscribe: () => {} } },
    };
  };

  supabase.auth.signOut = async () => {
    return { error: null };
  };

  supabase.auth.updateUser = async (updates) => {
    return {
      data: { user: { ...mockUsers[0], ...updates } },
      error: null,
    };
  };
}
