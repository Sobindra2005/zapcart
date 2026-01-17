"use client";


import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/utils/api";
import { MainContainer } from "../wrapper";
import { SectionHeader } from "../SectionHeader";
import { ProductsList } from "./productList";



export function ProductGrid() {
    const { data } = useQuery({
        queryKey: ['productForYou'],
        queryFn: () => productApi.getProducts()
    })

    return (
        <section className="w-full bg-background">
            <MainContainer className="container" spacing={true}>
                <SectionHeader title="Products For You" viewAllLink="" />
                <ProductsList products={data?.data?.products} />
            </MainContainer>
        </section>
    );
}


