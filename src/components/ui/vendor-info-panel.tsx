"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  description: string | null;
  website?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  vendor_id: string;
  description?: string;
  image_url?: string;
}

interface VendorInfoPanelProps {
  vendor: Vendor | null;
  products?: Product[]; // Make products optional
  onClose: () => void;
}

export function VendorInfoPanel({
  vendor,
  products = [],
  onClose,
}: VendorInfoPanelProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [onClose]);

  if (!vendor) return null;

  const vendorProducts = products.filter(
    (product) => product.vendor_id === vendor.id
  );

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Compact panel */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-lg shadow-xl dark:bg-gray-800 z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-blue-600 text-white p-4">
          <h2 className="text-lg font-semibold">{vendor.name}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {vendor.description || "No description available."}
          </p>

          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline mb-4"
            >
              <ExternalLink size={14} />
              <span>Visit Website</span>
            </a>
          )}

          {/* Products section */}
          {vendorProducts.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Products</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {vendorProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {product.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
