"use client";

import { Marketplace } from "@/components/3d/Marketplace";
import { Suspense } from "react";
import { Loader } from "@/components/ui/loader";

export default function MarketplacePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center">
              <Loader />
            </div>
          }
        >
          <Marketplace />
        </Suspense>
      </main>
    </div>
  );
}
