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

    // Get active product sections with their products
    const { data: sections, error: sectionsError } = await supabaseClient
      .from("product_sections")
      .select("*")
      .eq("active", true)
      .order("order", { ascending: true });

    if (sectionsError) {
      throw sectionsError;
    }

    // Get products for each section
    const sectionsWithProducts = await Promise.all(
      sections.map(async (section) => {
        // Get product IDs for this section
        const { data: sectionItems, error: itemsError } = await supabaseClient
          .from("product_section_items")
          .select("product_id, display_order")
          .eq("section_id", section.id)
          .order("display_order", { ascending: true });

        if (itemsError) {
          throw itemsError;
        }

        // Get product details
        const productIds = sectionItems.map((item) => item.product_id);

        let products = [];
        if (productIds.length > 0) {
          const { data: productData, error: productsError } =
            await supabaseClient
              .from("products")
              .select(
                `
              *,
              product_images(image_url, display_order)
            `,
              )
              .in("id", productIds);

          if (productsError) {
            throw productsError;
          }

          // Format products and maintain the order from section_items
          products = productIds
            .map((id) => {
              const product = productData.find((p) => p.id === id);
              if (!product) return null;

              // Get the main image (lowest display_order)
              const images = product.product_images || [];
              const mainImage =
                images.length > 0
                  ? images.sort((a, b) => a.display_order - b.display_order)[0]
                      .image_url
                  : null;

              return {
                id: product.id,
                title: product.title,
                price: product.price,
                discount: product.discount,
                isNew: product.is_new,
                image: mainImage,
                rating: 4.5, // Placeholder for now
              };
            })
            .filter(Boolean); // Remove any null entries
        }

        return {
          id: section.id,
          title: section.title,
          type: section.type,
          layout: section.layout,
          products,
        };
      }),
    );

    return new Response(JSON.stringify({ sections: sectionsWithProducts }), {
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
