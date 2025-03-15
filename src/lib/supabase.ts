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
  const mockUsers: any[] = [
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
  // @ts-ignore - Ignoring type errors for mock implementation
  supabase.auth.signInWithPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      return {
        data: {
          user,
          session: {
            access_token: "mock-token",
            refresh_token: "mock-refresh",
            expires_at: Date.now() + 3600,
            user: user,
          },
        },
        error: null,
      };
    } else {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" },
      };
    }
  };

  // @ts-ignore - Ignoring type errors for mock implementation
  supabase.auth.signUp = async ({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options?: { data?: any; emailRedirectTo?: string };
  }) => {
    // Check if user already exists
    if (mockUsers.some((u) => u.email === email)) {
      return {
        data: { user: null, session: null },
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
      data: { session: null, user: null },
      error: null,
    };
  };

  // @ts-ignore - Ignoring type errors for mock implementation
  supabase.auth.onAuthStateChange = () => {
    return {
      data: { subscription: { unsubscribe: () => {} } },
    };
  };

  supabase.auth.signOut = async () => {
    return { error: null };
  };

  supabase.auth.updateUser = async (updates: any) => {
    return {
      data: { user: { ...mockUsers[0], ...updates } },
      error: null,
    };
  };

  // Add admin namespace if it doesn't exist
  if (!supabase.auth.admin) {
    supabase.auth.admin = {
      updateUserById: async (userId: string, updates: any) => {
        return {
          data: { user: { id: userId, ...updates } },
          error: null,
        };
      },
      // @ts-ignore - Ignoring type errors for mock implementation
      listUsers: async () => {
        return {
          data: { users: mockUsers },
          error: null,
        };
      },
      createUser: async (userData: any) => {
        const newUser = {
          id: `user-${Date.now()}`,
          ...userData,
          created_at: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        return {
          data: { user: newUser },
          error: null,
        };
      },
    };
  }
}
