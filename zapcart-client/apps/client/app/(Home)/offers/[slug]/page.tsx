import { notFound } from "next/navigation";
import { sampleProducts } from "@/data/products";
import { OfferProductList } from "@/components/product/OfferProductList";


interface OfferPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return [{ slug: "flash-sale" }];
}

export default async function OfferPage({ params }: OfferPageProps) {
    const { slug } = await params;

    let products = [];
    let title = "";

    if (slug === "flash-sale") {
        products = sampleProducts;
        title = "Flash Sale";
    } else {
        return notFound();
    }

    return (
        <main>
            <OfferProductList title={title} products={products} />
        </main>
    );
}
