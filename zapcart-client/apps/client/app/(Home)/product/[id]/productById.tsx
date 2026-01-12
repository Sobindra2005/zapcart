"use client"

import { ProductImageGallery } from "@/components/ProductImageGallery"
import { ProductInfo } from "@/components/ProductInfo"
import { ReviewsSection } from "@/components/ReviewsSection"
import { Product } from "@/types/product"
import { productApi } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { EmptySection } from "@/components/emptySection"
import { Package, Loader2 } from "lucide-react"

export const ProductById = ({ productId }: {
    productId: string;
}) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await productApi.getProductById(productId);
            return response;
        }
    })

    const product: Product | undefined = data?.data.product;

    console.log("ProductById - productId:", productId, "product:", product, "isLoading:", isLoading, "error:", error);

    if (isLoading) {
        return (
            <EmptySection
                message="Loading product..."
                icon={<Loader2 size={48} className="animate-spin" />}
                minHeight="500px"
            />
        );
    }

    if (error || !product) {
        return (
            <EmptySection
                message="Product not found"
                description="The product you're looking for doesn't exist or has been removed."
                icon={<Package size={48} />}
                minHeight="500px"
            />
        );
    }

    return (
        <div className="py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Image Gallery */}
                <ProductImageGallery images={product.images} />

                {/* Right: Product Info */}
                <ProductInfo product={product} />
            </div>

            <ReviewsSection
                productId={productId}
            />
        </div>
    )
}