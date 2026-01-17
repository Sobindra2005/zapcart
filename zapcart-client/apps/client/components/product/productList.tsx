"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import { EmptySection } from "../emptySection";

interface ProductsListProps {
    products?: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
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