"use client";

import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/product";
import { MainContainer } from "./wrapper";
import { SectionHeader } from "./SectionHeader";
import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/utils/api";
import { EmptySection } from "./emptySection";


export function ProductGrid() {
    const { data } = useQuery({
        queryKey: ['featuredProducts'],
        queryFn: () => productApi.getProducts()
    })

    return (
        <section className="w-full bg-background">
            <MainContainer className="container" spacing={true}>
                <SectionHeader title="Products For You" viewAllLink="/products" />

                {(!data?.data || !data?.data?.products) ? 
                <EmptySection message="No products available at the moment." /> :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(data.data.products as Product[]).map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>}
            </MainContainer>
        </section>
    );
}


