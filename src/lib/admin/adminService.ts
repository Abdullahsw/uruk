import { supabase, supabaseAdmin } from "../supabase";
import { handleSupabaseError } from "../errorHandler";

/**
 * Log admin activity
 * @param actionType Type of action performed (e.g., "create", "update", "delete")
 * @param entityType Type of entity affected (e.g., "user", "product", "order")
 * @param entityId ID of the entity affected (optional)
 * @param details Additional details about the action (optional)
 */
export const logAdminActivity = async (
  actionType: string,
  entityType: string,
  entityId?: string,
  details?: any,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Call the admin-log-activity edge function
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-admin-log-activity",
      {
        body: { actionType, entityType, entityId, details },
      },
    );

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error logging admin activity:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Get admin dashboard statistics
 */
export const getAdminDashboardStats = async (): Promise<{
  success: boolean;
  stats?: any;
  error?: string;
}> => {
  try {
    // Call the admin-dashboard-stats edge function
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-admin-dashboard-stats",
      {},
    );

    if (error) throw error;
    return { success: true, stats: data.stats };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Get admin activity logs with pagination
 */
export const getAdminActivityLogs = async (
  limit = 20,
  offset = 0,
  filters?: {
    adminId?: string;
    actionType?: string;
    entityType?: string;
    dateFrom?: string;
    dateTo?: string;
  },
): Promise<{
  success: boolean;
  logs?: any[];
  count?: number;
  error?: string;
}> => {
  try {
    let query = supabase
      .from("admin_activity_logs")
      .select("*, admin:admin_id(name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters if provided
    if (filters) {
      if (filters.adminId) {
        query = query.eq("admin_id", filters.adminId);
      }
      if (filters.actionType) {
        query = query.eq("action_type", filters.actionType);
      }
      if (filters.entityType) {
        query = query.eq("entity_type", filters.entityType);
      }
      if (filters.dateFrom) {
        query = query.gte("created_at", filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte("created_at", filters.dateTo);
      }
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return { success: true, logs: data, count };
  } catch (error) {
    console.error("Error fetching admin activity logs:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Get admin settings
 */
export const getAdminSettings = async (): Promise<{
  success: boolean;
  settings?: any;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .order("setting_key", { ascending: true });

    if (error) throw error;

    // Convert array to object with setting_key as keys
    const settingsObject = data.reduce((acc, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {});

    return { success: true, settings: settingsObject };
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Update admin setting
 */
export const updateAdminSetting = async (
  key: string,
  value: any,
  description?: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("admin_settings").upsert(
      {
        setting_key: key,
        setting_value: value,
        description: description,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "setting_key" },
    );

    if (error) throw error;

    // Log the activity
    await logAdminActivity("update", "setting", key, { value });

    return { success: true };
  } catch (error) {
    console.error("Error updating admin setting:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Create or update admin API key
 */
export const manageAdminApiKey = async (keyData: {
  id?: string;
  key_name: string;
  permissions: any;
  expires_at?: string;
}): Promise<{ success: boolean; apiKey?: string; error?: string }> => {
  try {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    if (keyData.id) {
      // Update existing key
      const { error } = await supabase
        .from("admin_api_keys")
        .update({
          key_name: keyData.key_name,
          permissions: keyData.permissions,
          expires_at: keyData.expires_at,
        })
        .eq("id", keyData.id)
        .eq("admin_id", user.id);

      if (error) throw error;

      // Log the activity
      await logAdminActivity("update", "api_key", keyData.id, {
        name: keyData.key_name,
      });

      return { success: true };
    } else {
      // Generate a new API key
      const apiKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      // Create new key
      const { data, error } = await supabase
        .from("admin_api_keys")
        .insert({
          admin_id: user.id,
          key_name: keyData.key_name,
          api_key: apiKey,
          permissions: keyData.permissions,
          expires_at: keyData.expires_at,
        })
        .select()
        .single();

      if (error) throw error;

      // Log the activity
      await logAdminActivity("create", "api_key", data.id, {
        name: keyData.key_name,
      });

      return { success: true, apiKey };
    }
  } catch (error) {
    console.error("Error managing admin API key:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Get admin API keys
 */
export const getAdminApiKeys = async (): Promise<{
  success: boolean;
  keys?: any[];
  error?: string;
}> => {
  try {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("admin_api_keys")
      .select("*")
      .eq("admin_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Remove the actual API key from the response for security
    const safeData = data.map((key) => ({
      ...key,
      api_key:
        key.api_key.substring(0, 8) +
        "..." +
        key.api_key.substring(key.api_key.length - 4),
    }));

    return { success: true, keys: safeData };
  } catch (error) {
    console.error("Error fetching admin API keys:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Delete admin API key
 */
export const deleteAdminApiKey = async (
  keyId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get key name for logging
    const { data: keyData } = await supabase
      .from("admin_api_keys")
      .select("key_name")
      .eq("id", keyId)
      .eq("admin_id", user.id)
      .single();

    const { error } = await supabase
      .from("admin_api_keys")
      .delete()
      .eq("id", keyId)
      .eq("admin_id", user.id);

    if (error) throw error;

    // Log the activity
    await logAdminActivity("delete", "api_key", keyId, {
      name: keyData?.key_name,
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting admin API key:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Create or update admin dashboard widget
 */
export const manageAdminDashboardWidget = async (widgetData: {
  id?: string;
  widget_type: string;
  widget_title: string;
  widget_config: any;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  is_active?: boolean;
}): Promise<{ success: boolean; widget?: any; error?: string }> => {
  try {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    if (widgetData.id) {
      // Update existing widget
      const { data, error } = await supabase
        .from("admin_dashboard_widgets")
        .update({
          widget_type: widgetData.widget_type,
          widget_title: widgetData.widget_title,
          widget_config: widgetData.widget_config,
          position_x: widgetData.position_x,
          position_y: widgetData.position_y,
          width: widgetData.width,
          height: widgetData.height,
          is_active:
            widgetData.is_active !== undefined ? widgetData.is_active : true,
        })
        .eq("id", widgetData.id)
        .eq("admin_id", user.id)
        .select()
        .single();

      if (error) throw error;

      // Log the activity
      await logAdminActivity("update", "dashboard_widget", widgetData.id, {
        title: widgetData.widget_title,
      });

      return { success: true, widget: data };
    } else {
      // Create new widget
      const { data, error } = await supabase
        .from("admin_dashboard_widgets")
        .insert({
          admin_id: user.id,
          widget_type: widgetData.widget_type,
          widget_title: widgetData.widget_title,
          widget_config: widgetData.widget_config,
          position_x: widgetData.position_x,
          position_y: widgetData.position_y,
          width: widgetData.width,
          height: widgetData.height,
          is_active:
            widgetData.is_active !== undefined ? widgetData.is_active : true,
        })
        .select()
        .single();

      if (error) throw error;

      // Log the activity
      await logAdminActivity("create", "dashboard_widget", data.id, {
        title: widgetData.widget_title,
      });

      return { success: true, widget: data };
    }
  } catch (error) {
    console.error("Error managing admin dashboard widget:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Get admin dashboard widgets
 */
export const getAdminDashboardWidgets = async (): Promise<{
  success: boolean;
  widgets?: any[];
  error?: string;
}> => {
  try {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("admin_dashboard_widgets")
      .select("*")
      .eq("admin_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { success: true, widgets: data };
  } catch (error) {
    console.error("Error fetching admin dashboard widgets:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Delete admin dashboard widget
 */
export const deleteAdminDashboardWidget = async (
  widgetId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get current user ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get widget title for logging
    const { data: widgetData } = await supabase
      .from("admin_dashboard_widgets")
      .select("widget_title")
      .eq("id", widgetId)
      .eq("admin_id", user.id)
      .single();

    const { error } = await supabase
      .from("admin_dashboard_widgets")
      .delete()
      .eq("id", widgetId)
      .eq("admin_id", user.id);

    if (error) throw error;

    // Log the activity
    await logAdminActivity("delete", "dashboard_widget", widgetId, {
      title: widgetData?.widget_title,
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting admin dashboard widget:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};

/**
 * Create a new admin user (admin only)
 */
export const createAdminUser = async (
  email: string,
  password: string,
  userData: {
    name: string;
    username?: string;
    admin_permissions?: any;
  },
): Promise<{ success: boolean; user?: any; error?: string }> => {
  try {
    // Check if supabaseAdmin is available (service role client)
    if (!supabaseAdmin) {
      throw new Error("Admin operations are not available in this environment");
    }

    // Create user with admin role
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        username: userData.username,
        account_type: "admin",
        admin_permissions: userData.admin_permissions || { full_access: true },
      },
    });

    if (error) throw error;

    // Create user profile in the users table
    if (data.user) {
      const { error: profileError } = await supabaseAdmin.from("users").insert({
        id: data.user.id,
        email: data.user.email || "",
        name: userData.name,
        username: userData.username,
        account_type: "admin",
        admin_permissions: userData.admin_permissions || { full_access: true },
        created_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;
    }

    // Log the activity
    await logAdminActivity("create", "admin_user", data.user?.id, {
      email,
      name: userData.name,
    });

    return { success: true, user: data.user };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
};
