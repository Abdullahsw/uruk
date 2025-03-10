import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cartStore";
import { useCurrency } from "@/lib/currencyContext";
import { useLanguage } from "@/lib/languageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductSection from "@/components/home/ProductSection";
import ProductCard from "@/components/products/ProductCard";

// Mock product data
const mockProducts = [
  {
    id: "prod-001",
    title: "Premium Wireless Headphones",
    price: 129.99,
    rating: 4.5,
    discount: 15,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
    ],
    description:
      "Experience premium sound quality with these wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Built-in microphone",
      "Foldable design",
      "Includes carrying case",
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      Impedance: "32 Ohm",
      Battery: "500mAh",
      "Charging Time": "2 hours",
      Weight: "250g",
    },
    colors: ["Black", "White", "Blue"],
    stock: 24,
    sku: "WH-1000XM4",
    category: "Electronics",
    tags: ["headphones", "wireless", "audio"],
  },
  {
    id: "prod-002",
    title: "Smart Watch Series 5",
    price: 249.99,
    rating: 4.7,
    discount: 0,
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    ],
    description:
      "Stay connected and track your fitness with this advanced smartwatch. Features include heart rate monitoring, GPS, and a bright AMOLED display.",
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "Water resistant (50m)",
      "AMOLED display",
      "5-day battery life",
      "Smartphone notifications",
    ],
    specifications: {
      Display: "1.4 inch AMOLED",
      Resolution: "454 x 454 pixels",
      Battery: "420mAh",
      Sensors: "Heart rate, Accelerometer, Gyroscope",
      Connectivity: "Bluetooth 5.0, Wi-Fi",
      Weight: "45g",
    },
    colors: ["Black", "Silver", "Rose Gold"],
    stock: 15,
    sku: "SW-SERIES5",
    category: "Electronics",
    tags: ["smartwatch", "fitness", "wearable"],
  },
  {
    id: "prod-003",
    title: "Portable Bluetooth Speaker",
    price: 79.99,
    rating: 4.3,
    discount: 10,
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80",
    ],
    description:
      "Take your music anywhere with this portable Bluetooth speaker. Featuring 360° sound, waterproof design, and 12-hour battery life.",
    features: [
      "360° sound",
      "Waterproof (IPX7)",
      "12-hour battery life",
      "Built-in microphone",
      "Bluetooth 5.0",
      "USB-C charging",
    ],
    specifications: {
      "Speaker Output": "20W",
      "Frequency Response": "60Hz - 20kHz",
      Battery: "3600mAh",
      "Charging Time": "3 hours",
      Dimensions: "180 x 80 x 80 mm",
      Weight: "560g",
    },
    colors: ["Black", "Blue", "Red"],
    stock: 32,
    sku: "BT-SPEAKER-X3",
    category: "Electronics",
    tags: ["speaker", "bluetooth", "audio"],
  },
];

// Mock related products
const relatedProducts = [
  {
    id: "prod-004",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    title: "Noise Cancelling Earbuds",
    price: 89.99,
    rating: 4.2,
    discount: 0,
    isNew: false,
  },
  {
    id: "prod-005",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80",
    title: "Fitness Tracker Band",
    price: 49.99,
    rating: 4.0,
    discount: 5,
    isNew: false,
  },
  {
    id: "prod-006",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    title: "Waterproof Action Camera",
    price: 199.99,
    rating: 4.6,
    discount: 0,
    isNew: true,
  },
  {
    id: "prod-007",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
    title: "Wireless Charging Pad",
    price: 29.99,
    rating: 3.9,
    discount: 0,
    isNew: false,
  },
];

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const addToCart = useCartStore((state) => state.addItem);

  // Find the product by ID with error handling
  const [loading, setLoading] = useState(true);
  // Enhanced product finding logic to ensure exact product match
  const product = React.useMemo(() => {
    // Keep loading state true until we find the product
    setLoading(true);

    try {
      // Find the exact product by ID
      const foundProduct = mockProducts.find((p) => p.id === productId);

      if (foundProduct) {
        console.log(`Found exact product match for ID: ${productId}`);
        setLoading(false);
        return foundProduct;
      }

      // If product not found, log warning and use default
      console.warn(`Product with ID ${productId} not found, using fallback`);
      setLoading(false);
      return mockProducts[0];
    } catch (error) {
      console.error("Error finding product:", error);
      setLoading(false);
      return mockProducts[0];
    }
  }, [productId]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      discount: product.discount,
      quantity,
      color: selectedColor,
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Scroll to product details when component mounts
  React.useEffect(() => {
    if (!loading) {
      // Scroll to product details after a short delay to ensure rendering is complete
      setTimeout(() => {
        const element = document.getElementById("product-details-container");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [loading]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <button
                onClick={() => navigate("/")}
                className="hover:text-primary"
              >
                Home
              </button>
              <span className="mx-2">/</span>
              <button
                onClick={() => navigate("/products")}
                className="hover:text-primary"
              >
                Products
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{product.title}</span>
            </div>

            {/* Product Details */}
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden mb-12"
              id="product-details-container"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={product.images[currentImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />

                    {product.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}

                    {product.discount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute top-4 right-4"
                      >
                        {product.discount}% OFF
                      </Badge>
                    )}

                    {product.isNew && (
                      <Badge className="absolute top-4 left-4 bg-blue-500">
                        New
                      </Badge>
                    )}
                  </div>

                  {/* Thumbnail Images */}
                  {product.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto py-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          className={`w-20 h-20 rounded-md overflow-hidden border-2 ${index === currentImageIndex ? "border-primary" : "border-transparent"}`}
                          onClick={() => selectImage(index)}
                        >
                          <img
                            src={image}
                            alt={`${product.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"} ${i === Math.floor(product.rating) && product.rating % 1 > 0 ? "text-yellow-400 opacity-50" : ""}`}
                              fill={
                                i < Math.floor(product.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        <span className="text-sm text-gray-500 ml-1">
                          {product.rating}
                        </span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-500">
                        SKU: {product.sku}
                      </span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-green-500">
                        In Stock ({product.stock} available)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 my-4">
                    <div className="flex items-center">
                      {product.discount > 0 && (
                        <span className="text-gray-400 text-lg line-through mr-2">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(discountedPrice)}
                      </span>
                    </div>
                    {product.discount > 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        You save: {formatPrice(product.price - discountedPrice)}{" "}
                        ({product.discount}% off)
                      </p>
                    )}
                  </div>

                  <p className="text-gray-600">{product.description}</p>

                  {/* Color Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Color
                    </h3>
                    <div className="flex space-x-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? "border-primary" : "border-gray-200"}`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => setSelectedColor(color)}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        disabled={quantity >= product.stock}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      className="flex-1"
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {t("addToCart")}
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-500 w-24">
                        Category:
                      </span>
                      <span className="text-sm">{product.category}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-500 w-24">
                        Tags:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Tabs */}
              <div className="border-t border-gray-200">
                <Tabs defaultValue="features" className="p-6">
                  <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="specifications">
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger value="shipping">
                      Shipping & Returns
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="pt-6">
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="specifications" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex">
                            <span className="text-sm font-medium text-gray-500 w-40">
                              {key}:
                            </span>
                            <span className="text-sm">{value}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="shipping" className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Shipping</h3>
                        <p className="text-sm text-gray-600">
                          We offer free standard shipping on all orders over
                          $50. Expedited and international shipping options are
                          available at checkout.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Returns</h3>
                        <p className="text-sm text-gray-600">
                          If you're not completely satisfied with your purchase,
                          you can return it within 30 days for a full refund.
                          Items must be unused and in original packaging.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Related Products - Shown below the main product details with less prominence */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-medium mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product) => (
                  <div key={product.id} className="w-full mb-6">
                    <ProductCard
                      id={product.id}
                      image={product.image}
                      title={product.title}
                      price={product.price}
                      rating={product.rating}
                      discount={product.discount}
                      isNew={product.isNew}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
