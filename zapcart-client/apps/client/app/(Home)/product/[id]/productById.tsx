"use client"

import { ProductImageGallery } from "@/components/product/ProductImageGallery"
import { ReviewsSection } from "@/components/ReviewsSection"
import { Product } from "@/types/product"
import { productApi } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"
import { EmptySection } from "@/components/emptySection"
import { Package, Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { MainContainer } from "@/components/wrapper"
import { SectionHeader } from "@/components/SectionHeader"
import { ProductsList } from "@/components/product/productList"
import { ProductInfo } from "@/components/product/ProductInfo"

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

    const { data: relatedProductsData } = useQuery({
        queryKey: ['relatedProducts', productId],
        queryFn: async () => {
            const response = await productApi.getReleatedProducts(productId);
            return response;
        }
    })

    const product: Product | undefined = data?.data.product;

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
            notFound()
        );
    }

    return (
        <MainContainer className="container flex flex-col gap-10" spacing={true}>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Image Gallery */}
                <ProductImageGallery images={product.images} />
                {/* Right: Product Info */}
                <ProductInfo product={product} />
            </div>
            <ReviewsSection
                productId={productId}
            />
            
            <div>
                <SectionHeader title="Related Products" viewAllLink="" />
                <ProductsList products={relatedProductsData?.data?.products} />
            </div>
        </MainContainer>
    )
}