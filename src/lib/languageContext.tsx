import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en" | "ku";

type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Define translations for the website
const translations: Translations = {
  // Header
  home: {
    ar: "الرئيسية",
    en: "Home",
    ku: "سەرەکی",
  },
  products: {
    ar: "المنتجات",
    en: "Products",
    ku: "بەرهەمەکان",
  },
  categories: {
    ar: "الفئات",
    en: "Categories",
    ku: "پۆلەکان",
  },
  deals: {
    ar: "العروض",
    en: "Deals",
    ku: "داشکاندنەکان",
  },
  about: {
    ar: "عن المتجر",
    en: "About",
    ku: "دەربارە",
  },
  contact: {
    ar: "اتصل بنا",
    en: "Contact",
    ku: "پەیوەندی",
  },
  search: {
    ar: "بحث عن المنتجات...",
    en: "Search products...",
    ku: "گەڕان بۆ بەرهەمەکان...",
  },
  signIn: {
    ar: "تسجيل الدخول",
    en: "Sign In",
    ku: "چوونە ژوورەوە",
  },
  myAccount: {
    ar: "حسابي",
    en: "My Account",
    ku: "هەژمارەکەم",
  },
  orders: {
    ar: "الطلبات",
    en: "Orders",
    ku: "داواکارییەکان",
  },
  wishlist: {
    ar: "المفضلة",
    en: "Wishlist",
    ku: "دڵخوازەکان",
  },
  resellerDashboard: {
    ar: "لوحة تحكم الموزع",
    en: "Reseller Dashboard",
    ku: "داشبۆردی دابەشکەر",
  },
  adminDashboard: {
    ar: "لوحة تحكم المدير",
    en: "Admin Dashboard",
    ku: "داشبۆردی بەڕێوەبەر",
  },
  logout: {
    ar: "تسجيل الخروج",
    en: "Logout",
    ku: "چوونە دەرەوە",
  },
  cart: {
    ar: "سلة التسوق",
    en: "Cart",
    ku: "سەبەتە",
  },

  // Auth
  login: {
    ar: "تسجيل الدخول",
    en: "Login",
    ku: "چوونە ژوورەوە",
  },
  register: {
    ar: "إنشاء حساب",
    en: "Register",
    ku: "تۆمارکردن",
  },
  email: {
    ar: "البريد الإلكتروني",
    en: "Email",
    ku: "ئیمەیل",
  },
  password: {
    ar: "كلمة المرور",
    en: "Password",
    ku: "وشەی نهێنی",
  },
  confirmPassword: {
    ar: "تأكيد كلمة المرور",
    en: "Confirm Password",
    ku: "دڵنیابوونەوە لە وشەی نهێنی",
  },
  fullName: {
    ar: "الاسم الكامل",
    en: "Full Name",
    ku: "ناوی تەواو",
  },
  accountType: {
    ar: "نوع الحساب",
    en: "Account Type",
    ku: "جۆری هەژمار",
  },
  customer: {
    ar: "عميل",
    en: "Customer",
    ku: "کڕیار",
  },
  reseller: {
    ar: "موزع",
    en: "Reseller/Distributor",
    ku: "دابەشکەر",
  },
  resellerPlan: {
    ar: "خطة الموزع",
    en: "Reseller Plan",
    ku: "پلانی دابەشکەر",
  },
  basic: {
    ar: "أساسي (1,000 منتج)",
    en: "Basic (1,000 products)",
    ku: "سادە (١٠٠٠ بەرهەم)",
  },
  standard: {
    ar: "قياسي (5,000 منتج + نطاق مخصص)",
    en: "Standard (5,000 products + custom domain)",
    ku: "ستاندارد (٥٠٠٠ بەرهەم + دۆمەینی تایبەت)",
  },
  premium: {
    ar: "متميز (منتجات غير محدودة + نطاق مخصص)",
    en: "Premium (Unlimited products + custom domain)",
    ku: "پرێمیۆم (بەرهەمی نا سنووردار + دۆمەینی تایبەت)",
  },
  loginButton: {
    ar: "تسجيل الدخول",
    en: "Login",
    ku: "چوونە ژوورەوە",
  },
  registerButton: {
    ar: "تسجيل",
    en: "Register",
    ku: "تۆمارکردن",
  },
  dontHaveAccount: {
    ar: "ليس لديك حساب؟",
    en: "Don't have an account?",
    ku: "هەژمارت نییە؟",
  },
  alreadyHaveAccount: {
    ar: "لديك حساب بالفعل؟",
    en: "Already have an account?",
    ku: "پێشتر هەژمارت هەیە؟",
  },

  // Product related
  addToCart: {
    ar: "أضف إلى السلة",
    en: "Add to Cart",
    ku: "زیادکردن بۆ سەبەتە",
  },
  shopNow: {
    ar: "تسوق الآن",
    en: "Shop Now",
    ku: "ئێستا بکڕە",
  },
  featuredProducts: {
    ar: "منتجات مميزة",
    en: "Featured Products",
    ku: "بەرهەمە تایبەتەکان",
  },
  newArrivals: {
    ar: "وصل حديثاً",
    en: "New Arrivals",
    ku: "بەرهەمە نوێیەکان",
  },
  specialOffers: {
    ar: "عروض خاصة",
    en: "Special Offers",
    ku: "پێشنیارە تایبەتەکان",
  },
  shopByCategory: {
    ar: "تسوق حسب الفئة",
    en: "Shop by Category",
    ku: "کڕین بەپێی پۆل",
  },
  products: {
    ar: "منتجات",
    en: "products",
    ku: "بەرهەمەکان",
  },
  new: {
    ar: "جديد",
    en: "New",
    ku: "نوێ",
  },
  off: {
    ar: "خصم",
    en: "OFF",
    ku: "داشکاندن",
  },
  newCollection: {
    ar: "تشكيلة جديدة",
    en: "New Collection",
    ku: "کۆلێکشنی نوێ",
  },
  shopNow: {
    ar: "تسوق الآن",
    en: "Shop Now",
    ku: "ئێستا بکڕە",
  },
  learnMore: {
    ar: "اعرف المزيد",
    en: "Learn More",
    ku: "زیاتر بزانە",
  },
  viewAll: {
    ar: "عرض الكل",
    en: "View All",
    ku: "هەموو ببینە",
  },
  currencyDemo: {
    ar: "عرض توضيحي للعملة",
    en: "Currency Demo",
    ku: "پیشاندانی دراو",
  },
  productDetails: {
    ar: "تفاصيل المنتج",
    en: "Product Details",
    ku: "وردەکاری بەرهەم",
  },
  addToCart: {
    ar: "أضف إلى السلة",
    en: "Add to Cart",
    ku: "زیادکردن بۆ سەبەتە",
  },
  youMayAlsoLike: {
    ar: "قد يعجبك أيضاً",
    en: "You May Also Like",
    ku: "لەوانەیە ئەمانەشت پێ خۆش بێت",
  },
  features: {
    ar: "المميزات",
    en: "Features",
    ku: "تایبەتمەندییەکان",
  },
  specifications: {
    ar: "المواصفات",
    en: "Specifications",
    ku: "تایبەتمەندییە تەکنیکییەکان",
  },
  shipping: {
    ar: "الشحن والإرجاع",
    en: "Shipping & Returns",
    ku: "بارکردن و گەڕاندنەوە",
  },
  color: {
    ar: "اللون",
    en: "Color",
    ku: "ڕەنگ",
  },
  quantity: {
    ar: "الكمية",
    en: "Quantity",
    ku: "بڕ",
  },
  category: {
    ar: "الفئة",
    en: "Category",
    ku: "پۆل",
  },
  tags: {
    ar: "العلامات",
    en: "Tags",
    ku: "تاگەکان",
  },
  relatedProducts: {
    ar: "منتجات ذات صلة",
    en: "Related Products",
    ku: "بەرهەمە پەیوەندیدارەکان",
  },
  bestsellers: {
    ar: "الأكثر مبيعاً",
    en: "Bestsellers",
    ku: "زۆرترین فرۆشراو",
  },
  specialOffers: {
    ar: "عروض خاصة",
    en: "Special Offers",
    ku: "پێشنیارە تایبەتەکان",
  },

  // Admin Dashboard
  adminDashboardTitle: {
    ar: "لوحة تحكم المدير",
    en: "Admin Dashboard",
    ku: "داشبۆردی بەڕێوەبەر",
  },
  managePlatform: {
    ar: "إدارة المنصة والمستخدمين والموزعين",
    en: "Manage your platform, users, and resellers",
    ku: "بەڕێوەبردنی پلاتفۆرم، بەکارهێنەران و دابەشکەران",
  },
  totalUsers: {
    ar: "إجمالي المستخدمين",
    en: "Total Users",
    ku: "کۆی بەکارهێنەران",
  },
  activeResellers: {
    ar: "الموزعين النشطين",
    en: "Active Resellers",
    ku: "دابەشکەرە چالاکەکان",
  },
  totalProducts: {
    ar: "إجمالي المنتجات",
    en: "Total Products",
    ku: "کۆی بەرهەمەکان",
  },
  totalRevenue: {
    ar: "إجمالي الإيرادات",
    en: "Total Revenue",
    ku: "کۆی داهات",
  },
  thisMonth: {
    ar: "هذا الشهر",
    en: "this month",
    ku: "ئەم مانگە",
  },
  users: {
    ar: "المستخدمين",
    en: "Users",
    ku: "بەکارهێنەران",
  },
  resellers: {
    ar: "الموزعين",
    en: "Resellers",
    ku: "دابەشکەران",
  },
  apiRequests: {
    ar: "طلبات API",
    en: "API Requests",
    ku: "داواکارییەکانی API",
  },
  currency: {
    ar: "العملة",
    en: "Currency",
    ku: "دراو",
  },
  settings: {
    ar: "الإعدادات",
    en: "Settings",
    ku: "ڕێکخستنەکان",
  },

  // Currency Rates
  currencyRates: {
    ar: "أسعار صرف العملات",
    en: "Currency Exchange Rates",
    ku: "نرخی گۆڕینەوەی دراو",
  },
  manageCurrencyRates: {
    ar: "إدارة أسعار صرف العملات للمنصة",
    en: "Set and manage currency exchange rates for your platform",
    ku: "دانان و بەڕێوەبردنی نرخی گۆڕینەوەی دراو بۆ پلاتفۆرمەکەت",
  },
  lastUpdated: {
    ar: "آخر تحديث:",
    en: "Last updated:",
    ku: "دوایین نوێکردنەوە:",
  },
  fetchLatestRates: {
    ar: "جلب أحدث الأسعار",
    en: "Fetch Latest Rates",
    ku: "هێنانی دوایین نرخەکان",
  },
  usdToIqdRate: {
    ar: "سعر الدولار الأمريكي إلى الدينار العراقي",
    en: "USD to IQD Rate",
    ku: "نرخی دۆلاری ئەمریکی بۆ دیناری عێراقی",
  },
  sarToIqdRate: {
    ar: "سعر الريال السعودي إلى الدينار العراقي",
    en: "SAR to IQD Rate",
    ku: "نرخی ڕیاڵی سعودی بۆ دیناری عێراقی",
  },
  usdToSarRate: {
    ar: "سعر الدولار الأمريكي إلى الريال السعودي",
    en: "USD to SAR Rate",
    ku: "نرخی دۆلاری ئەمریکی بۆ ڕیاڵی سعودی",
  },
  conversionPreview: {
    ar: "معاينة تحويل العملات",
    en: "Currency Conversion Preview",
    ku: "پێشبینینی گۆڕینی دراو",
  },
  saveRates: {
    ar: "حفظ أسعار الصرف",
    en: "Save Exchange Rates",
    ku: "پاشەکەوتکردنی نرخەکانی گۆڕینەوە",
  },
  saving: {
    ar: "جاري الحفظ...",
    en: "Saving...",
    ku: "پاشەکەوت دەکرێت...",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: () => "rtl" | "ltr";
};

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: () => {},
  t: (key: string) => key,
  dir: () => "rtl",
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("ar");

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  const dir = (): "rtl" | "ltr" => {
    return language === "ar" ? "rtl" : "ltr";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
