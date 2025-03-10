import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
  );
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a service role client for admin operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

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
