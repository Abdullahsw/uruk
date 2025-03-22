import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { actionType, entityType, entityId, details } = await req.json();

    // Validate required fields
    if (!actionType || !entityType) {
      throw new Error("Action type and entity type are required");
    }

    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Verify the user is an admin
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("account_type")
      .eq("id", user.id)
      .single();

    if (userError || userData?.account_type !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Get client IP address
    const ipAddress = req.headers.get("x-forwarded-for") || "unknown";

    // Log the admin activity
    const { data, error } = await supabaseClient
      .from("admin_activity_logs")
      .insert({
        admin_id: user.id,
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId || null,
        details: details || null,
        ip_address: ipAddress,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, log: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
