/**
 * Global error handler for Supabase operations
 * Provides consistent error handling across the application
 */

/**
 * Process a Supabase error and return a user-friendly message
 * @param error The error object from Supabase
 * @returns A user-friendly error message
 */
export const handleSupabaseError = (error: any): string => {
  console.error("Supabase operation error:", error);

  // Handle specific error codes
  if (error?.code === "PGRST301") {
    return "You don't have permission to perform this action";
  }

  if (error?.code === "PGRST204") {
    return "The requested resource was not found";
  }

  if (error?.code === "23505") {
    return "A record with this information already exists";
  }

  if (error?.code === "23503") {
    return "This operation violates database constraints";
  }

  if (error?.code === "42501") {
    return "You don't have permission to perform this action";
  }

  if (error?.code === "42P01") {
    return "Database configuration error";
  }

  if (error?.message?.includes("JWT")) {
    return "Your session has expired. Please log in again.";
  }

  if (error?.message?.includes("duplicate key")) {
    return "This record already exists";
  }

  if (error?.message?.includes("violates foreign key constraint")) {
    return "This operation references a record that doesn't exist";
  }

  if (error?.message?.includes("violates check constraint")) {
    return "The data you provided is invalid";
  }

  // Default error message
  return (
    error?.message || error?.error_description || "An unexpected error occurred"
  );
};

/**
 * Wrap a Supabase operation in a try-catch block with standardized error handling
 * @param operation The async operation to perform
 * @param errorHandler Optional custom error handler
 * @returns The result of the operation or an error object
 */
export const safeSupabaseOperation = async <T>(
  operation: () => Promise<T>,
  errorHandler?: (error: any) => any,
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const result = await operation();
    return { data: result, error: null };
  } catch (error) {
    const errorMessage = errorHandler
      ? errorHandler(error)
      : handleSupabaseError(error);
    return { data: null, error: errorMessage };
  }
};

// This function is deprecated and will be removed in future versions
// Use direct try/catch blocks instead for better type safety
