"use client";

import { Hero } from "@/components/Hero";
import { FlashSaleCard } from "@/components/FlashSaleCard";
import { PopularCategories } from "@/components/PopularCategories";
import { ProductGrid } from "@/components/ProductGrid";
import { sampleProducts } from "@/data/products";
import { FeaturedProducts } from "@/components/featuredProduct";
import { useQuery } from "@tanstack/react-query";
import { systemSettingsApi } from "@/utils/api";
import type { SystemSetting } from "@/types/systemSetting";

export default function Home() {
  const { error } = useQuery<SystemSetting[]>({
    queryKey: ['systemSettings'],
    queryFn: systemSettingsApi.getSettings,
  });

  if (error) {
    return <div>Error loading system settings.</div>;
  }

  return (
    <main>
      <Hero />
      <PopularCategories />
      <FlashSaleCard />
      <FeaturedProducts />
      <ProductGrid products={sampleProducts} />
    </main>
  );
}