import { supabase } from "../supabase";
import { User } from "@supabase/supabase-js";
import { handleSupabaseError, safeSupabaseOperation } from "../errorHandler";

/**
 * Register a new user
 * @param email User's email
 * @param password User's password
 * @param userData Additional user data (name, account_type, etc.)
 * @returns Object with success status, user data, and error message if any
 */
export const registerUser = async (
  email: string,
  password: string,
  userData: {
    name: string;
    username?: string;
    account_type: "customer" | "reseller" | "admin";
    reseller_plan?: "basic" | "standard" | "premium";
  },
): Promise<{
  success: boolean;
  user: any | null;
  error: string | null;
  session?: any;
}> => {
  try {
    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) throw error;

    // If registration successful, create a profile in the users table
    if (data.user) {
      await createUserProfile(data.user, userData);
    }

    return {
      success: true,
      user: data.user,
      error: null,
      session: data.session,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      user: null,
      error: handleSupabaseError(error),
      session: null,
    };
  }
};

/**
 * Create a user profile in the users table
 * @param user The authenticated user object
 * @param userData Additional user data
 */
export const createUserProfile = async (
  user: User,
  userData: {
    name: string;
    username?: string;
    account_type: "customer" | "reseller" | "admin";
    reseller_plan?: "basic" | "standard" | "premium";
  },
) => {
  try {
    // Check if user profile already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existingUser) {
      // User already exists, update instead of insert
      const { error } = await supabase
        .from("users")
        .update({
          name: userData.name,
          username: userData.username,
          account_type: userData.account_type,
          reseller_plan: userData.reseller_plan,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
    } else {
      // Insert new user
      const { error } = await supabase.from("users").insert({
        id: user.id,
        email: user.email || "", // Ensure email is never null
        name: userData.name,
        username: userData.username,
        account_type: userData.account_type,
        reseller_plan: userData.reseller_plan,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

/**
 * Login a user
 * @param email User's email
 * @param password User's password
 * @returns Object with success status, session data, and error message if any
 */
export const loginUser = async (
  email: string,
  password: string,
): Promise<{
  success: boolean;
  session: any | null;
  user: any | null;
  error: string | null;
}> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      success: true,
      session: data.session,
      user: data.user,
      error: null,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      session: null,
      user: null,
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Fetch user profile data
 * @param userId The user's ID
 * @returns User profile data
 */
export const getUserProfile = async (
  userId: string,
): Promise<{ success: boolean; profile: any | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { success: true, profile: data, error: null };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      profile: null,
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Update user profile
 * @param userId The user's ID
 * @param updates Profile updates
 * @returns Updated profile data
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    name?: string;
    username?: string;
    reseller_plan?: "basic" | "standard" | "premium";
    [key: string]: any; // Allow other fields
  },
): Promise<{ success: boolean; profile: any | null; error: string | null }> => {
  try {
    // Don't allow updating critical fields like id, email, account_type directly
    const safeUpdates = { ...updates };
    delete safeUpdates.id;
    delete safeUpdates.email;
    delete safeUpdates.account_type;
    delete safeUpdates.created_at;

    // Add updated_at timestamp
    safeUpdates.updated_at = new Date().toISOString();

    // Update the profile
    const { data, error } = await supabase
      .from("users")
      .update(safeUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // Also update user metadata in auth.users if needed
    if (updates.name) {
      try {
        await supabase.auth.updateUser({
          data: { name: updates.name },
        });
      } catch (metadataError) {
        console.warn(
          "Failed to update auth metadata, but profile was updated",
          metadataError,
        );
        // Continue anyway since the main profile update succeeded
      }
    }

    return { success: true, profile: data, error: null };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      profile: null,
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Update user password
 * @param currentPassword Current password for verification
 * @param newPassword New password
 * @returns Success status and error message if any
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // First verify the current password by attempting to reauthenticate
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) {
      return {
        success: false,
        error: "You must be logged in to change your password",
      };
    }

    const email = authData.session.user.email;
    if (!email) {
      return {
        success: false,
        error: "User email not found",
      };
    }

    // Try to sign in with current password to verify it
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    // Update the password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      error: handleSupabaseError(error),
    };
  }
};

/**
 * Fetch users by role
 * @param role The role to filter by (customer, reseller, admin)
 * @param limit Maximum number of users to return
 * @param offset Pagination offset
 * @returns List of users with the specified role
 */
export const getUsersByRole = async (
  role: "customer" | "reseller" | "admin",
  limit = 100,
  offset = 0,
): Promise<{
  success: boolean;
  users?: any[];
  count?: number;
  error?: string;
}> => {
  try {
    const { data, error, count } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("account_type", role)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { success: true, users: data, count };
  } catch (error: any) {
    console.error(`Error fetching ${role} users:`, error);
    return {
      success: false,
      error: error.message || `Failed to fetch ${role} users`,
    };
  }
};

/**
 * Search users by name, email, or username
 * @param query Search query
 * @param limit Maximum number of users to return
 * @returns List of matching users
 */
export const searchUsers = async (
  query: string,
  limit = 20,
): Promise<{ success: boolean; users?: any[]; error?: string }> => {
  try {
    // Convert query to lowercase for case-insensitive search
    const searchTerm = query.toLowerCase();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(
        `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`,
      )
      .limit(limit);

    if (error) throw error;

    return { success: true, users: data };
  } catch (error: any) {
    console.error("Error searching users:", error);
    return {
      success: false,
      error: error.message || "Failed to search users",
    };
  }
};

/**
 * Delete a user (admin only)
 * @param userId The ID of the user to delete
 * @returns Success status and error message if any
 */
export const deleteUser = async (
  userId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if the current user is an admin
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) {
      return {
        success: false,
        error: "You must be logged in to perform this action",
      };
    }

    const currentUserId = authData.session.user.id;
    const { data: currentUser } = await supabase
      .from("users")
      .select("account_type")
      .eq("id", currentUserId)
      .single();

    if (!currentUser || currentUser.account_type !== "admin") {
      return {
        success: false,
        error: "Only administrators can delete users",
      };
    }

    // Delete the user from the users table
    // Note: This will cascade to delete from auth.users due to the foreign key constraint
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.message || "Failed to delete user",
    };
  }
};
