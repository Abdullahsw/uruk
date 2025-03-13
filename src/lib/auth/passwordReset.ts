import { supabase } from "../supabase";
import { handleSupabaseError, safeSupabaseOperation } from "../errorHandler";

/**
 * Request a password reset for a user
 * @param email The email address of the user
 * @returns Object with success status and message
 */
export const requestPasswordReset = async (
  email: string,
): Promise<{ success: boolean; message: string; token: string | null }> => {
  try {
    // First check if the user exists
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return {
        success: false,
        message: "No account found with that email address.",
        token: null,
      };
    }

    // Call the database function to create a reset token
    const { data, error } = await supabase.rpc("request_password_reset", {
      user_email: email,
    });

    if (error) {
      console.error("RPC error:", error);
      throw error;
    }

    if (data === "User not found") {
      return {
        success: false,
        message: "No account found with that email address.",
        token: null,
      };
    }

    // Fallback: If RPC fails, create token directly
    if (!data) {
      // Generate a random token
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Set expiration to 24 hours from now
      const expires_at = new Date();
      expires_at.setHours(expires_at.getHours() + 24);

      // Insert the token
      const { error: insertError } = await supabase
        .from("password_reset_tokens")
        .insert({
          user_id: userData.id,
          token: token,
          expires_at: expires_at.toISOString(),
        });

      if (insertError) {
        console.error("Token insert error:", insertError);
        throw insertError;
      }

      // In a real application, you would send an email with the reset link
      console.log("Reset token (would be sent via email):", token);

      return {
        success: true,
        message: "Password reset instructions have been sent to your email.",
        token: token, // In production, don't return this to the client
      };
    }

    // In a real application, you would send an email with the reset link
    console.log("Reset token (would be sent via email):", data);

    return {
      success: true,
      message: "Password reset instructions have been sent to your email.",
      token: data, // In production, don't return this to the client
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return {
      success: false,
      message:
        handleSupabaseError(error) ||
        "Failed to process your request. Please try again later.",
      token: null,
    };
  }
};

/**
 * Verify a password reset token and reset the user's password
 * @param token The reset token
 * @param newPassword The new password
 * @returns Object with success status and message
 */
export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // First verify the token
    const { data, error } = await supabase.rpc("verify_reset_token", {
      token,
    });

    if (error) {
      console.error("RPC error:", error);

      // Fallback: If RPC fails, verify token directly
      const { data: tokenData, error: tokenError } = await supabase
        .from("password_reset_tokens")
        .select("user_id, used, expires_at")
        .eq("token", token)
        .single();

      if (tokenError || !tokenData) {
        return {
          success: false,
          message:
            "Invalid or expired reset token. Please request a new password reset.",
        };
      }

      // Check if token is expired or used
      const now = new Date();
      const expiresAt = new Date(tokenData.expires_at);

      if (tokenData.used || expiresAt < now) {
        return {
          success: false,
          message:
            "Invalid or expired reset token. Please request a new password reset.",
        };
      }

      // Mark token as used
      await supabase
        .from("password_reset_tokens")
        .update({ used: true })
        .eq("token", token);

      // Update the user's password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        tokenData.user_id,
        { password: newPassword },
      );

      if (updateError) {
        // Try regular update if admin update fails
        const { error: regularUpdateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (regularUpdateError) throw regularUpdateError;
      }

      return {
        success: true,
        message:
          "Your password has been successfully reset. You can now log in with your new password.",
      };
    }

    if (!data || !data.valid) {
      return {
        success: false,
        message:
          "Invalid or expired reset token. Please request a new password reset.",
      };
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      // Try admin update if regular update fails
      const { error: adminUpdateError } =
        await supabase.auth.admin.updateUserById(data.user_id, {
          password: newPassword,
        });

      if (adminUpdateError) throw adminUpdateError;
    }

    return {
      success: true,
      message:
        "Your password has been successfully reset. You can now log in with your new password.",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message:
        handleSupabaseError(error) ||
        "Failed to reset your password. Please try again later.",
    };
  }
};
