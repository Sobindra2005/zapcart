"use client"

import Image from "next/image"
import { Button } from "@repo/ui/ui/button"
import { MainContainer } from "./wrapper"
import { SectionHeader } from "./SectionHeader"
import { useQuery } from "@tanstack/react-query"
import { productApi } from "@/utils/api"
import { Product } from "@/types/product"

export function FeaturedProducts() {

    const { data, error, isLoading } = useQuery({
        queryKey: ['featuredProducts'],
        queryFn: () => productApi.getProducts()
    })

    const products: Product[] = data?.data?.products || [];

    const heroProduct: Product = products.length > 0 ? products[0] : {} as Product;

    const gridProducts: Product[] = products.length > 1 ? products.slice(1) : [];

    const showSkeleton = isLoading || products.length === 0;

    return (
        <MainContainer spacing={true}>
            <SectionHeader title="Featured Products" viewAllLink="/products" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large Featured Product */}
                {showSkeleton ? (
                    <HeroProductSkeleton />
                ) : (
                    <div className="lg:col-span-1 lg:row-span-2 group relative rounded-xl overflow-hidden bg-muted">
                        <div className="relative w-full h-96 lg:h-full min-h-96">
                            <Image
                                src={heroProduct.images?.[0] || heroProduct.thumbnail || "/placeholder.svg"}
                                alt={heroProduct.name || "Product"}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300 bg-orange-500"
                                sizes="(max-width: 1024px) 100vw, 33vw"
                            />
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                            <h3 className="text-2xl font-bold text-white mb-2">{heroProduct.name}</h3>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-3xl font-bold text-accent">${heroProduct.basePrice}</span>
                                {heroProduct.compareAtPrice && (
                                    <span className="text-lg text-white/70 line-through">${heroProduct.compareAtPrice}</span>
                                )}
                            </div>
                            <Button className=" bg-red-400 hover:bg-red-600 w-full">Shop Now</Button>
                        </div>
                    </div>
                )
                }

                {/* Grid Products */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
                    {showSkeleton ? (
                        // Skeleton loaders for grid products
                        <GridProductSkeleton />
                    ) : (
                        gridProducts.map((product, idx) => (
                            <div key={product.id || product._id || idx} className="group relative rounded-xl overflow-hidden bg-muted cursor-pointer">
                                <div className="relative w-full aspect-square">
                                    <Image
                                        src={product.images?.[0] || product.thumbnail || "/placeholder.svg"}
                                        alt={product.name || "Product"}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300 bg-blue-500"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-3">
                                    <h4 className="text-white font-semibold text-sm mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {product.name}
                                    </h4>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-accent font-bold">
                                            ${product.basePrice}
                                        </p>
                                        {product.compareAtPrice && (
                                            <p className="text-white/70 text-sm line-through">
                                                ${product.compareAtPrice}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div >

        </MainContainer >
    )
}

function HeroProductSkeleton() {
    return (
        <div className="lg:col-span-1 lg:row-span-2 relative rounded-xl overflow-hidden bg-muted animate-pulse">
            <div className="w-full h-96 lg:h-full min-h-96 bg-gray-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="h-8 bg-gray-400 rounded mb-2 w-3/4"></div>
                <div className="flex gap-3 mb-4">
                    <div className="h-10 bg-gray-400 rounded w-24"></div>
                    <div className="h-10 bg-gray-400 rounded w-20"></div>
                </div>
                <div className="h-10 bg-gray-400 rounded w-full"></div>
            </div>
        </div>
    )
}


function GridProductSkeleton() {
    return (
        Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden bg-muted animate-pulse">
                <div className="w-full aspect-square bg-gray-300"></div>
            </div>
        ))
    )
}