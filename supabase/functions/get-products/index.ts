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

    // Get query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const isNew = url.searchParams.get("isNew") === "true";
    const hasDiscount = url.searchParams.get("hasDiscount") === "true";

    // Build query
    let query = supabaseClient
      .from("products")
      .select(
        `
        *,
        product_images(*),
        product_tags(*)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    // Apply filters if provided
    if (category) {
      query = query.eq("category", category);
    }

    if (isNew) {
      query = query.eq("is_new", true);
    }

    if (hasDiscount) {
      query = query.gt("discount", 0);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Format the response
    const formattedProducts = data.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      discount: product.discount,
      stock: product.stock,
      category: product.category,
      sku: product.sku,
      isNew: product.is_new,
      images: product.product_images
        .map((img) => img.image_url)
        .sort((a, b) => a.display_order - b.display_order),
      tags: product.product_tags.map((tag) => tag.tag),
      createdAt: product.created_at,
    }));

    return new Response(
      JSON.stringify({
        products: formattedProducts,
        count: formattedProducts.length,
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
