import { supabase } from "./supabase";

// This function creates an admin user if it doesn't exist
export const seedAdminUser = async () => {
  try {
    // Check if admin user exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", "admin@shophub.com")
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking for admin user:", checkError);
      return;
    }

    // If admin doesn't exist, create one
    if (!existingUsers) {
      // First try to create the user
      const { error: signUpError, data: signUpData } =
        await supabase.auth.signUp({
          email: "admin@shophub.com",
          password: "Admin123!",
          options: {
            data: {
              name: "Admin User",
              account_type: "admin",
            },
          },
        });

      // If there's an error or no user was created, try to sign in and update the user metadata
      if (signUpError || !signUpData.user) {
        console.log("Trying to update existing admin user...");
        const { error: signInError, data: signInData } =
          await supabase.auth.signInWithPassword({
            email: "admin@shophub.com",
            password: "Admin123!",
          });

        if (!signInError && signInData.user) {
          // Update the user metadata to ensure they have admin privileges
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              name: "Admin User",
              account_type: "admin",
            },
          });

          if (updateError) {
            console.error("Error updating admin user metadata:", updateError);
          } else {
            console.log("Admin user metadata updated successfully");
          }

          // Sign out after updating
          await supabase.auth.signOut();
        }
      }

      if (signUpError) {
        console.error("Error creating admin user:", signUpError);
      } else {
        console.log("Admin user created successfully");
      }
    }
  } catch (error) {
    console.error("Error in seedAdminUser:", error);
  }
};
