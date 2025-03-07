/* eslint-disable */
"use client";

import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { Canvas } from "./Canvas";
import { Ground } from "./Ground";
import { Stall } from "./Stall";
import { EnvironmentDecorations } from "./Environment";
import { Loader } from "@/components/ui/loader";
import { VendorInfoPanel } from "@/components/ui/vendor-info-panel";

// Interfaces for type safety
interface StallData {
  id: string;
  vendor_id: string;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
  color: string;
  name: string;
  stall_type: number;
}

interface VendorData {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website?: string;
  location?: string;
  contact_email?: string;
  social_media?: Record<string, string>;
  founded_year?: number;
}

// Interface for product data
interface ProductData {
  id: string;
  name: string;
  price: number;
  vendor_id: string;
  description?: string;
  image_url?: string;
}

// Enhanced mock data with more business-like information
const MOCK_VENDORS: Record<string, VendorData> = {
  "mock-vendor-1": {
    id: "mock-vendor-1",
    name: "Artisan Crafts Co.",
    description:
      "Family-owned business specializing in handcrafted goods since 1995. All our products are made using traditional techniques and sustainably sourced materials.",
    logo_url: "/placeholder.svg?height=100&width=100",
    website: "https://artisancraftsco.com",
    location: "Central Market, Stall #14",
    contact_email: "info@artisancraftsco.com",
    social_media: {
      instagram: "@artisancraftsco",
      facebook: "ArtisanCraftsCo",
    },
    founded_year: 1995,
  },
  "mock-vendor-2": {
    id: "mock-vendor-2",
    name: "TechNovus",
    description:
      "Cutting-edge tech accessories and gadgets for professionals and enthusiasts. Our products include the latest in wearable tech, smart home devices, and productivity tools.",
    logo_url: "/placeholder.svg?height=100&width=100",
    website: "https://technovus.io",
    location: "Innovation District, Booth #42",
    contact_email: "support@technovus.io",
    social_media: {
      twitter: "@technovus",
      youtube: "TechNovusOfficial",
    },
    founded_year: 2018,
  },
  "mock-vendor-3": {
    id: "mock-vendor-3",
    name: "Global Flavors",
    description:
      "Gourmet spices and specialty food ingredients from around the world. We work directly with farmers to bring you authentic flavors while supporting sustainable agriculture.",
    logo_url: "/placeholder.svg?height=100&width=100",
    website: "https://globalflavors.com",
    location: "Food Hall, Section C",
    contact_email: "hello@globalflavors.com",
    social_media: {
      instagram: "@globalflavors",
      pinterest: "GlobalFlavorsRecipes",
    },
    founded_year: 2010,
  },
  "mock-vendor-4": {
    id: "mock-vendor-4",
    name: "Timeless Treasures",
    description:
      "Curated collection of vintage items, antiques, and collectibles with fascinating histories. Each piece is carefully authenticated and restored when necessary.",
    logo_url: "/placeholder.svg?height=100&width=100",
    website: "https://timelesstreasures.market",
    location: "Antique Quarter, Booth #7",
    contact_email: "curator@timelesstreasures.market",
    social_media: {
      instagram: "@timelesstreasures_market",
      etsy: "TimelessTreasuresShop",
    },
    founded_year: 2005,
  },
  "mock-vendor-5": {
    id: "mock-vendor-5",
    name: "Eco Essentials",
    description:
      "Sustainable home goods and personal care products made from eco-friendly materials. Our mission is to make zero-waste living accessible and stylish.",
    logo_url: "/placeholder.svg?height=100&width=100",
    website: "https://ecoessentials.life",
    location: "Green Zone, Stall #22",
    contact_email: "hello@ecoessentials.life",
    social_media: {
      instagram: "@eco.essentials",
      tiktok: "@ecoessentialslife",
    },
    founded_year: 2019,
  },
  "mock-vendor-6": {
    id: "mock-vendor-6",
    name: "Literary Haven",
    description:
      "Independent bookstore specializing in rare editions, local authors, and curated reading collections. Our staff are passionate readers with expertise across all genres.",
    logo_url: "/placeholder.svg?height=100&width=100",
    website: "https://literaryhaven.books",
    location: "Arts District, Store #3",
    contact_email: "books@literaryhaven.books",
    social_media: {
      goodreads: "LiteraryHavenBooks",
      twitter: "@literaryhaven",
    },
    founded_year: 2012,
  },
  "mock-vendor-7": {
    id: "mock-vendor-7",
    name: "Comp AI",
    description:
      "Enterprise-grade Compliance Automation Platform powered by AI. Streamline your compliance process with frameworks like SOC 2, ISO 27001, GDPR, and HIPAA. Our cutting-edge technology reduces compliance time by 75% and automates evidence collection with 24/7 monitoring for continuous compliance.",
    logo_url: "/placeholder.svg?height=150&width=150",
    website: "https://trycomp.ai",
    location: "Tech Hub, Premium Central Position",
    contact_email: "info@trycomp.ai",
    social_media: {
      twitter: "@compai",
      linkedin: "compai",
      github: "compai-automation",
      instagram: "@compai.official",
    },
    founded_year: 2021,
  },
  "mock-vendor-8": {
    id: "mock-vendor-8",
    name: "Softgen AI",
    description:
      "Softgen is your AI Web App Developer. Describe your vision, give instructions, and build full-stack web apps. No coding required.",
    logo_url: "/placeholder.svg?height=150&width=150",
    website: "https://softgen.ai",
    location: "Tech District, Premium Location",
    contact_email: "info@softgen.ai",
    social_media: {
      twitter: "@softgenai",
      github: "softgen-ai",
    },
    founded_year: 2023,
  },
} as const;

// Update MOCK_STALLS to add vendor 5, 6, and 8
const MOCK_STALLS: StallData[] = [
  {
    id: "mock-stall-1",
    vendor_id: "mock-vendor-1",
    position_x: -10,
    position_y: 0,
    position_z: -10,
    rotation_y: 0.5,
    color: "#4287f5",
    name: "Artisan Crafts Co.",
    stall_type: 1,
  },
  {
    id: "mock-stall-2",
    vendor_id: "mock-vendor-2",
    position_x: 10,
    position_y: 0,
    position_z: -10,
    rotation_y: -0.5,
    color: "#f54242",
    name: "TechNovus",
    stall_type: 2,
  },
  {
    id: "mock-stall-3",
    vendor_id: "mock-vendor-3",
    position_x: -10,
    position_y: 0,
    position_z: 10,
    rotation_y: 0.9,
    color: "#42f56f",
    name: "Global Flavors",
    stall_type: 3,
  },
  {
    id: "mock-stall-4",
    vendor_id: "mock-vendor-4",
    position_x: 10,
    position_y: 0,
    position_z: 10,
    rotation_y: -0.9,
    color: "#f5a742",
    name: "Timeless Treasures",
    stall_type: 4,
  },
  {
    id: "mock-stall-5",
    vendor_id: "mock-vendor-5",
    position_x: -15,
    position_y: 0,
    position_z: 0,
    rotation_y: Math.PI / 2,
    color: "#42d1f5",
    name: "Eco Essentials",
    stall_type: 1,
  },
  {
    id: "mock-stall-6",
    vendor_id: "mock-vendor-6",
    position_x: 15,
    position_y: 0,
    position_z: 0,
    rotation_y: -Math.PI / 2,
    color: "#9142f5",
    name: "Literary Haven",
    stall_type: 3,
  },
  {
    id: "mock-stall-7",
    vendor_id: "mock-vendor-7",
    position_x: 0,
    position_y: 1,
    position_z: 0,
    rotation_y: 0,
    color: "#0066ff",
    name: "Comp AI",
    stall_type: 2,
  },
  {
    id: "mock-stall-8",
    vendor_id: "mock-vendor-8",
    position_x: 20,
    position_y: 1,
    position_z: 0,
    rotation_y: -Math.PI / 3,
    color: "#6366f1",
    name: "Softgen AI",
    stall_type: 2,
  },
] as const;

// Memoized 3D scene components to prevent re-renders
const MemoizedGround = memo(Ground);
const MemoizedEnvironmentDecorations = memo(EnvironmentDecorations);

// Memoized stall component
const MemoizedStall = memo(Stall);

// Function to preload mock products by vendor
const getMockProductsByVendorId = (vendorId: string) => {
  switch (vendorId) {
    case "mock-vendor-1": // Artisan Crafts Co.
      return [
        {
          id: "product-1-1",
          name: "Hand-carved Wooden Bowl",
          description:
            "Beautifully crafted wooden bowl made from sustainable oak. Each piece is unique with natural grain patterns and finished with food-safe oils.",
          price: 45.99,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-1",
        },
        {
          id: "product-1-2",
          name: "Ceramic Mug Set",
          description:
            "Set of 4 handmade ceramic mugs in earthy tones. Microwave and dishwasher safe.",
          price: 39.95,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-1",
        },
        {
          id: "product-1-3",
          name: "Woven Wall Hanging",
          description:
            "Intricate wall tapestry handwoven from natural cotton and wool fibers. Perfect as a statement piece for any room.",
          price: 89.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-1",
        },
      ];
    case "mock-vendor-2": // TechNovus
      return [
        {
          id: "product-2-1",
          name: "SmartCharge Pro",
          description:
            "Wireless charging pad with built-in smart assistant. Compatible with all Qi-enabled devices.",
          price: 79.99,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-2",
        },
        {
          id: "product-2-2",
          name: "AirBuds X3",
          description:
            "Noise-cancelling wireless earbuds with 30-hour battery life and waterproof design.",
          price: 129.95,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-2",
        },
        {
          id: "product-2-3",
          name: "FoldScreen Mini",
          description:
            "Portable second monitor for your laptop or smartphone. Weighs just 1.2 pounds and folds to the size of a tablet.",
          price: 249.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-2",
        },
      ];
    case "mock-vendor-3": // Global Flavors
      return [
        {
          id: "product-3-1",
          name: "Global Spice Collection",
          description:
            "Set of 12 premium spices from around the world, packaged in air-tight glass containers.",
          price: 65.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-3",
        },
        {
          id: "product-3-2",
          name: "Artisanal Olive Oil",
          description:
            "Cold-pressed extra virgin olive oil from small-batch producers in Mediterranean groves.",
          price: 28.5,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-3",
        },
        {
          id: "product-3-3",
          name: "Exotic Hot Sauce Set",
          description:
            "Three unique hot sauces featuring rare peppers from South America, Africa, and Asia.",
          price: 35.99,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-3",
        },
      ];
    case "mock-vendor-4": // Timeless Treasures
      return [
        {
          id: "product-4-1",
          name: "Vintage Pocket Watch",
          description:
            "Restored 1920s mechanical pocket watch with intricate engravings. Fully functional and comes with display case.",
          price: 195.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-4",
        },
        {
          id: "product-4-2",
          name: "Art Deco Lamp",
          description:
            "Original Art Deco table lamp with stained glass shade. Rewired and restored to perfect working condition.",
          price: 275.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-4",
        },
        {
          id: "product-4-3",
          name: "Antique Leather-bound Book",
          description:
            "19th century leather-bound classic novel with gold leaf detailing. In excellent condition for its age.",
          price: 120.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-4",
        },
      ];
    case "mock-vendor-5": // Eco Essentials
      return [
        {
          id: "product-5-1",
          name: "Bamboo Utensil Set",
          description:
            "Reusable bamboo cutlery set with carrying case. Includes fork, knife, spoon, chopsticks, and cleaning brush.",
          price: 18.99,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-5",
        },
        {
          id: "product-5-2",
          name: "Beeswax Food Wraps",
          description:
            "Set of 5 reusable food wraps made from organic cotton and beeswax. A sustainable alternative to plastic wrap.",
          price: 24.5,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-5",
        },
        {
          id: "product-5-3",
          name: "Zero Waste Starter Kit",
          description:
            "Everything you need to begin your zero waste journey: reusable bags, containers, bottles, and personal care items.",
          price: 75.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-5",
        },
      ];
    case "mock-vendor-6": // Literary Haven
      return [
        {
          id: "product-6-1",
          name: "First Edition Collection",
          description:
            "Set of three first edition modern classics in protected sleeves with certificates of authenticity.",
          price: 350.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-6",
        },
        {
          id: "product-6-2",
          name: "Local Authors Anthology",
          description:
            "Curated collection of short stories from emerging local writers. Exclusive to Literary Haven.",
          price: 24.95,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-6",
        },
        {
          id: "product-6-3",
          name: "Rare Poetry Volumes",
          description:
            "Limited run of handbound poetry collections with original illustrations. Numbered and signed by the authors.",
          price: 85.0,
          image_url: "/placeholder.svg?height=200&width=200",
          vendor_id: "mock-vendor-6",
        },
      ];
    case "mock-vendor-7": // Comp AI
      return [
        {
          id: "product-7-1",
          name: "ComplianceOS Enterprise",
          description:
            "Comprehensive compliance automation platform with AI-powered evidence collection, policy management, risk assessment, and real-time monitoring. Supports all major frameworks with customizable dashboard and integration capabilities.",
          price: 499.99,
          image_url: "/placeholder.svg?height=250&width=250",
          vendor_id: "mock-vendor-7",
        },
        {
          id: "product-7-2",
          name: "SOC 2 Accelerator",
          description:
            "Complete solution for SOC 2 compliance with automated evidence collection, gap analysis, and pre-built controls. Reduces certification time from months to weeks with AI-generated documentation and continuous monitoring.",
          price: 299.95,
          image_url: "/placeholder.svg?height=250&width=250",
          vendor_id: "mock-vendor-7",
        },
        {
          id: "product-7-3",
          name: "Privacy Shield Suite",
          description:
            "All-in-one platform for privacy compliance including GDPR, CCPA, and HIPAA. Features data mapping, automated subject rights request handling, breach notification workflows, and custom privacy policy generation.",
          price: 249.99,
          image_url: "/placeholder.svg?height=250&width=250",
          vendor_id: "mock-vendor-7",
        },
        {
          id: "product-7-4",
          name: "ComplianceAPI Premium",
          description:
            "Enterprise API access to Comp AI's compliance engine with up to 100,000 requests per month. Seamlessly integrate compliance checks into your development and deployment pipelines with real-time validation and audit trails.",
          price: 399.99,
          image_url: "/placeholder.svg?height=250&width=250",
          vendor_id: "mock-vendor-7",
        },
        {
          id: "product-7-5",
          name: "Compliance Training Academy",
          description:
            "Comprehensive training platform for your team with interactive courses on compliance frameworks, security best practices, and regulatory requirements. Includes certification tracks and progress monitoring.",
          price: 149.99,
          image_url: "/placeholder.svg?height=250&width=250",
          vendor_id: "mock-vendor-7",
        },
      ];
    case "mock-vendor-8": // Softgen AI
      return [
        {
          id: "product-8-1",
          name: "AI Web App Builder",
          description:
            "Build complete web applications using natural language instructions. Includes database setup, API integration, and responsive UI design.",
          price: 299.99,
          image_url: "/placeholder.svg?height=250&width=250",
          vendor_id: "mock-vendor-8",
        },
        {
          id: "product-8-2",
          name: "Custom AI Integration",
          description:
            "Add AI capabilities to your existing web applications. Includes chatbots, recommendation systems, and content generation.",
          price: 199.99,
          image_url: "/placeholder.svg?height=250&width=250",
          vendor_id: "mock-vendor-8",
        },
        {
          id: "product-8-3",
          name: "AI Development Consultation",
          description:
            "One-on-one consultation sessions to plan and optimize your AI-powered web applications.",
          price: 149.99,
          image_url: "/placeholder.svg?height=250&width=250",
          vendor_id: "mock-vendor-8",
        },
      ];
    default:
      return [
        {
          id: "default-product-1",
          name: "Sample Product",
          description: "This is a sample product description.",
          price: 19.99,
          image_url: "/placeholder.svg?height=100&width=100",
          vendor_id: "unknown",
        },
      ];
  }
};

export function Marketplace() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const marketplaceRef = useRef<HTMLDivElement>(null);

  const [stalls, setStalls] = useState<StallData[]>([]);
  const [vendors] = useState<Record<string, VendorData>>(MOCK_VENDORS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStall, setSelectedStall] = useState<string | null>(null);
  const [cameraPosition] = useState<[number, number, number]>([0, 20, 45]);
  const [vendorPanelOpen, setVendorPanelOpen] = useState<boolean>(false);

  // Memoized handlers with improved performance
  const handleStallInteraction = useCallback(
    (stallId: string) => {
      if (selectedStall === stallId && vendorPanelOpen) {
        // If clicking the same stall while the panel is open, close it
        setVendorPanelOpen(false);
        return;
      }

      // Select the stall (this updates the highlighting)
      setSelectedStall(stallId);

      // Then, in a separate tick, open the panel - this prevents the
      // browser from doing layout/rendering work all at once
      requestAnimationFrame(() => {
        setVendorPanelOpen(true);
      });

      console.log("Interacted with stall:", stallId);
    },
    [selectedStall, vendorPanelOpen]
  );

  const handleCloseVendorPanel = useCallback(() => {
    // We keep the stall selected even when the panel is closed
    // this keeps the stall highlighted in the 3D view
    setVendorPanelOpen(false);
  }, []);

  // Data fetching with proper error handling
  useEffect(() => {
    const loadStalls = async () => {
      try {
        setLoading(true);
        setStalls(MOCK_STALLS);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load marketplace data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadStalls();
  }, []);

  // Memoize selected stall info to prevent recalculation
  const selectedStallInfo = useMemo(() => {
    if (!selectedStall) return null;

    const stall = stalls.find((s) => s.id === selectedStall);
    if (!stall) return null;

    const vendor = vendors[stall.vendor_id] || {
      id: "unknown",
      name: "Unknown Vendor",
      description: "No vendor information available",
      logo_url: "/placeholder.svg?height=100&width=100",
    };

    return { stall, vendor };
  }, [selectedStall, stalls, vendors]);

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader size={48} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={marketplaceRef} className="relative h-screen w-full">
      {/* Vendor Info Panel - Directly use the component which handles its own visibility */}
      {selectedStallInfo && vendorPanelOpen && (
        <VendorInfoPanel
          vendor={selectedStallInfo.vendor}
          onClose={handleCloseVendorPanel}
        />
      )}

      {/* 3D Canvas - Wrapped in a stable container */}
      <div ref={canvasRef} className="h-screen w-full">
        <Canvas cameraPosition={cameraPosition} enableShadows={true}>
          <MemoizedGround />
          <MemoizedEnvironmentDecorations />

          {stalls.map((stall) => (
            <MemoizedStall
              key={stall.id}
              stallId={stall.id}
              vendorId={stall.vendor_id}
              position={[stall.position_x, stall.position_y, stall.position_z]}
              rotation={[0, stall.rotation_y, 0]}
              color={stall.color}
              name={stall.name}
              stallType={stall.stall_type}
              highlighted={selectedStall === stall.id}
              onInteract={() => handleStallInteraction(stall.id)}
            />
          ))}
        </Canvas>
      </div>

      {/* Simple help tooltip */}
      <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md text-sm text-gray-600 dark:text-gray-300 z-10">
        <p>Click on a stall to view vendor information</p>
      </div>
    </div>
  );
}
