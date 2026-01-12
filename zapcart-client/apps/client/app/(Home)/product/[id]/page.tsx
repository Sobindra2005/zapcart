import { notFound } from "next/navigation";
import { sampleProducts } from "@/data/products";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { ReviewsSection } from "@/components/ReviewsSection";
import { MainContainer } from "@/components/wrapper";
import { getQueryClient } from "../../../../../../packages/ui/src/get-query-client";
import { productApi, reviewsApi, systemSettingsApi } from "@/utils/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductById } from "./productById";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['systemSettings'],
        queryFn: async () => {
            const response = await systemSettingsApi.getSettings()
            return response.data;
        }
    })

    await queryClient.prefetchQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProductById(id)
    })

    await queryClient.prefetchQuery({
        queryKey: ['productReviews', id],
        queryFn: () => reviewsApi.getReviewsByProductId(id)
    })


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MainContainer className="max-w-7xl">
                <ProductById productId={id}/>
            </MainContainer>
        </HydrationBoundary>
    );
}
