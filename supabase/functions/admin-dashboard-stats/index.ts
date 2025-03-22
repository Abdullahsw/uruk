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

    // Verify the user is an admin
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

    // Get user metadata to check if admin
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

    // Get dashboard stats
    const [usersResult, resellersResult, productsResult, ordersResult] =
      await Promise.all([
        // Total users count
        supabaseClient.from("users").select("id", { count: "exact" }),

        // Active resellers count
        supabaseClient
          .from("users")
          .select("id", { count: "exact" })
          .eq("account_type", "reseller"),

        // Total products count
        supabaseClient.from("products").select("id", { count: "exact" }),

        // Total orders and revenue
        supabaseClient.from("orders").select("id, total"),
      ]);

    // Calculate total revenue
    const totalRevenue = ordersResult.data
      ? ordersResult.data.reduce((sum, order) => sum + (order.total || 0), 0)
      : 0;

    // Get new users this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { count: newUsersThisMonth } = await supabaseClient
      .from("users")
      .select("id", { count: "exact" })
      .gte("created_at", firstDayOfMonth.toISOString());

    // Get new resellers this month
    const { count: newResellersThisMonth } = await supabaseClient
      .from("users")
      .select("id", { count: "exact" })
      .eq("account_type", "reseller")
      .gte("created_at", firstDayOfMonth.toISOString());

    // Get new products this month
    const { count: newProductsThisMonth } = await supabaseClient
      .from("products")
      .select("id", { count: "exact" })
      .gte("created_at", firstDayOfMonth.toISOString());

    // Get revenue this month
    const { data: ordersThisMonth } = await supabaseClient
      .from("orders")
      .select("total")
      .gte("created_at", firstDayOfMonth.toISOString());

    const revenueThisMonth = ordersThisMonth
      ? ordersThisMonth.reduce((sum, order) => sum + (order.total || 0), 0)
      : 0;

    // Calculate percentage changes
    const lastMonth = new Date(firstDayOfMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const { data: lastMonthOrders } = await supabaseClient
      .from("orders")
      .select("total")
      .gte("created_at", lastMonth.toISOString())
      .lt("created_at", firstDayOfMonth.toISOString());

    const revenueLastMonth = lastMonthOrders
      ? lastMonthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      : 0;

    const revenuePercentChange =
      revenueLastMonth > 0
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
        : 0;

    // Return the dashboard stats
    return new Response(
      JSON.stringify({
        stats: {
          users: {
            total: usersResult.count || 0,
            newThisMonth: newUsersThisMonth || 0,
          },
          resellers: {
            total: resellersResult.count || 0,
            newThisMonth: newResellersThisMonth || 0,
          },
          products: {
            total: productsResult.count || 0,
            newThisMonth: newProductsThisMonth || 0,
          },
          revenue: {
            total: totalRevenue,
            thisMonth: revenueThisMonth,
            percentChange: revenuePercentChange.toFixed(1),
          },
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
