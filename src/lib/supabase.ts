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
}
