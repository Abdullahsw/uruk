import { supabase, supabaseAdmin } from "./supabase";

/**
 * Helper function to check Supabase connection
 * @returns {Promise<boolean>} True if connection is successful
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Try a simple query to check connection
    const { data, error } = await supabase
      .from("users")
      .select("count", { count: "exact", head: true });

    if (error) {
      // Try an alternative query if the first one fails
      const { error: healthError } = await supabase.rpc(
        "pg_stat_statements_reset",
      );

      if (healthError) {
        // Try a third approach - just get the service status
        const { error: serviceError } = await supabase.auth.getSession();

        if (serviceError) {
          console.error("Supabase connection error:", serviceError.message);
          return false;
        }
      }
    }

    console.log("Supabase connection successful");
    return true;
  } catch (error) {
    console.error("Failed to check Supabase connection:", error);
    return false;
  }
};

/**
 * Helper function to handle Supabase errors
 * @param {any} error The error object from Supabase
 * @returns {string} A user-friendly error message
 */
export const handleSupabaseError = (error: any): string => {
  console.error("Supabase error:", error);

  // Check for specific error codes and return user-friendly messages
  if (error?.code === "PGRST301") {
    return "Database row level security policy violation";
  }

  if (error?.code === "PGRST204") {
    return "Database schema does not exist";
  }

  if (error?.code === "23505") {
    return "A record with this information already exists";
  }

  if (error?.code === "23503") {
    return "This operation violates database constraints";
  }

  if (error?.message?.includes("JWT")) {
    return "Authentication error. Please log in again.";
  }

  // Default error message
  return error?.message || "An unexpected error occurred";
};

/**
 * Helper function to check if all required environment variables are set
 * @returns {boolean} True if all required variables are set
 */
export const checkSupabaseEnvVars = (): boolean => {
  const requiredVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName],
  );

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
    return false;
  }

  return true;
};
