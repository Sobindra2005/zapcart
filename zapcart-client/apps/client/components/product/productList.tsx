"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import { EmptySection } from "../emptySection";
import { Card, CardContent } from "@repo/ui/ui/card";

interface ProductsListProps {
    products?: Product[];
    isLoading?: boolean;
}

export function ProductsList({ products, isLoading }: ProductsListProps) {
    if (isLoading) {
        return <ProductsListSkeleton />;
    }

    if (!products || products.length === 0) {
        return <EmptySection message="No products available at the moment." />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
                <ProductCard key={product.id || product._id} product={product} />
            ))}
        </div>
    );
}

function ProductsListSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <Card className="group overflow-hidden transition-all">
                    <CardContent className="p-4">
                        {/* Image Container Skeleton */}
                        <div className="relative aspect-square mb-4 bg-muted rounded-lg animate-pulse" />

                        {/* Product Info Skeleton */}
                        <div className="space-y-2">
                            <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-muted rounded animate-pulse w-full" />

                            {/* Price Skeleton */}
                            <div className="flex items-center justify-between">
                                <div className="h-6 bg-muted rounded animate-pulse w-20" />
                                <div className="h-4 bg-muted rounded animate-pulse w-16" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}