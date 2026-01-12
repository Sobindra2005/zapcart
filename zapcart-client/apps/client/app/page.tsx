import { Hero } from "@/components/Hero";
import { FlashSaleCard } from "@/components/FlashSaleCard";
import { PopularCategories } from "@/components/PopularCategories";
import { ProductGrid } from "@/components/ProductGrid";
import { FeaturedProducts } from "@/components/featuredProduct";
import { getQueryClient } from "../../../packages/ui/src/get-query-client";
import { productApi } from "@/utils/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productApi.getProducts()
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Hero />
        <PopularCategories />
        <FlashSaleCard />
        <FeaturedProducts />
        <ProductGrid />
      </main>
    </HydrationBoundary>
  );
}