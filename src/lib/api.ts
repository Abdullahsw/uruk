import { supabase } from "./supabase";

/**
 * Fetch products from the database
 * @param options Query options
 * @returns Products array and count
 */
export const fetchProducts = async (options: {
  category?: string;
  limit?: number;
  offset?: number;
  isNew?: boolean;
  hasDiscount?: boolean;
}) => {
  try {
    // Try to use the edge function if available
    const { data: functionData, error: functionError } =
      await supabase.functions.invoke("get-products", {
        body: options,
      });

    if (!functionError && functionData) {
      return functionData;
    }

    // Fallback to direct database query if edge function fails
    console.log("Falling back to direct database query for products");

    let query = supabase
      .from("products")
      .select(
        `
        *,
        product_images(*),
        product_tags(*)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(options.limit || 50)
      .range(
        options.offset || 0,
        (options.offset || 0) + (options.limit || 50) - 1,
      );

    if (options.category) {
      query = query.eq("category", options.category);
    }

    if (options.isNew) {
      query = query.eq("is_new", true);
    }

    if (options.hasDiscount) {
      query = query.gt("discount", 0);
    }

    const { data, error, count } = await query;

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

    return {
      products: formattedProducts,
      count: count || formattedProducts.length,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return mock data for development
    return {
      products: [],
      count: 0,
      error: error.message,
    };
  }
};

/**
 * Fetch advertisements from the database
 * @returns Active advertisements
 */
export const fetchAdvertisements = async () => {
  try {
    // Try to use the edge function if available
    const { data: functionData, error: functionError } =
      await supabase.functions.invoke("get-advertisements");

    if (!functionError && functionData) {
      return functionData.advertisements;
    }

    // Fallback to direct database query if edge function fails
    console.log("Falling back to direct database query for advertisements");

    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Format the response
    return data.map((ad) => ({
      id: ad.id,
      title: ad.title,
      imageUrl: ad.image_url,
      redirectUrl: ad.redirect_url,
      duration: ad.duration,
      active: ad.active,
    }));
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    // Return mock data for development
    return [];
  }
};

/**
 * Fetch product sections from the database
 * @returns Active product sections with their products
 */
export const fetchProductSections = async () => {
  try {
    // Try to use the edge function if available
    const { data: functionData, error: functionError } =
      await supabase.functions.invoke("get-product-sections");

    if (!functionError && functionData) {
      return functionData.sections;
    }

    // Fallback to direct database query if edge function fails
    console.log("Falling back to direct database query for product sections");

    // This is a complex query that would be better handled by the edge function
    // For simplicity, we'll return an empty array here
    console.warn(
      "Direct query for product sections not implemented in fallback",
    );
    return [];
  } catch (error) {
    console.error("Error fetching product sections:", error);
    // Return mock data for development
    return [];
  }
};

/**
 * Fetch currency rates from the database
 * @returns Latest currency rates
 */
export const fetchCurrencyRates = async () => {
  try {
    const { data, error } = await supabase
      .from("currency_rates")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return {
      usdToIqd: data.usd_to_iqd,
      sarToIqd: data.sar_to_iqd,
      usdToSar: data.usd_to_sar,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    // Return default rates
    return {
      usdToIqd: 1460,
      sarToIqd: 389.33,
      usdToSar: 3.75,
      updatedAt: new Date().toISOString(),
    };
  }
};

/**
 * Update currency rates
 * @param rates New currency rates
 * @returns Success status
 */
export const updateCurrencyRates = async (rates: {
  usdToIqd: number;
  sarToIqd: number;
  usdToSar: number;
}) => {
  try {
    const { error } = await supabase.from("currency_rates").insert({
      usd_to_iqd: rates.usdToIqd,
      sar_to_iqd: rates.sarToIqd,
      usd_to_sar: rates.usdToSar,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating currency rates:", error);
    return { success: false, error: error.message };
  }
};
