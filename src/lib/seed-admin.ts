import { supabase, supabaseAdmin } from "./supabase";
import { handleSupabaseError } from "./supabaseHelpers";

// This function creates an admin user if it doesn't exist
export const seedAdminUser = async () => {
  try {
    // First check if we can connect to Supabase
    const { data: healthCheck, error: healthError } = await supabase
      .from("auth.users")
      .select("count", { count: "exact", head: true });

    if (healthError) {
      console.error(
        "Supabase health check failed:",
        handleSupabaseError(healthError),
      );
      return;
    }

    // Check if admin user exists in auth.users
    const { data: existingUsers, error: checkError } =
      await supabase.auth.admin.listUsers();

    if (checkError) {
      // If we can't use admin methods, try a different approach
      console.warn(
        "Admin API not available, trying alternative approach:",
        handleSupabaseError(checkError),
      );

      // Try to sign in as admin to check if it exists
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: "admin@shophub.com",
          password: "Admin123!",
        });

      if (!signInError && signInData.user) {
        console.log("Admin user exists and credentials are valid");
        await supabase.auth.signOut();
        return;
      }

      // If sign-in failed, it might be because the user doesn't exist or password is wrong
      console.log("Admin user might not exist, attempting to create...");
    } else {
      // Check if admin exists in the returned users
      const adminExists = existingUsers?.users?.some(
        (user) =>
          user.email === "admin@shophub.com" &&
          user.user_metadata?.account_type === "admin",
      );

      if (adminExists) {
        console.log("Admin user already exists");
        return;
      }
    }

    // If admin doesn't exist, create one
    console.log("Creating admin user...");

    // Try to use supabaseAdmin if available for creating users
    if (supabaseAdmin) {
      const { data: adminCreateData, error: adminCreateError } =
        await supabaseAdmin.auth.admin.createUser({
          email: "admin@shophub.com",
          password: "Admin123!",
          user_metadata: {
            name: "Admin User",
            account_type: "admin",
          },
          email_confirm: true,
        });

      if (adminCreateError) {
        console.error(
          "Error creating admin user with admin API:",
          handleSupabaseError(adminCreateError),
        );
      } else {
        console.log("Admin user created successfully with admin API");
        return;
      }
    }

    // Fallback to regular signup if admin API fails or is not available
    const { error: signUpError, data: signUpData } = await supabase.auth.signUp(
      {
        email: "admin@shophub.com",
        password: "Admin123!",
        options: {
          data: {
            name: "Admin User",
            account_type: "admin",
          },
        },
      },
    );

    if (signUpError) {
      console.error(
        "Error creating admin user:",
        handleSupabaseError(signUpError),
      );
    } else {
      console.log("Admin user signup initiated successfully");

      // Create a corresponding entry in the public.users table if needed
      try {
        if (signUpData.user?.id) {
          const { error: profileError } = await supabase.from("users").upsert({
            id: signUpData.user.id,
            email: "admin@shophub.com",
            name: "Admin User",
            account_type: "admin",
            created_at: new Date().toISOString(),
          });

          if (profileError) {
            console.error(
              "Error creating admin profile:",
              handleSupabaseError(profileError),
            );
          }
        }
      } catch (profileError) {
        console.error("Error creating admin profile:", profileError);
      }
    }
  } catch (error) {
    console.error("Error in seedAdminUser:", error);
  }
};
