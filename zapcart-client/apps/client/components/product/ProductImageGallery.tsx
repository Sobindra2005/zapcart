"use client";

import { useState } from "react";
import { cn } from "@repo/lib/utils";

interface ProductImageGalleryProps {
    images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    const handleImageError = (index: number) => {
        setImageErrors(prev => new Set(prev).add(index));
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-5/4 bg-gray-100 rounded-2xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                    {images[selectedImage] && !imageErrors.has(selectedImage) ? (
                        <img
                            src={images[selectedImage]}
                            alt={`Product Image ${selectedImage + 1}`}
                            className="object-cover w-full h-full"
                            onError={() => handleImageError(selectedImage)}
                        />
                    ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                    )}
                </div>
            </div>

            <div className="flex gap-3 overflow-x-auto p-1">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all shrink-0 w-20 h-20",
                            selectedImage === index
                                ? "ring-2 ring-black"
                                : "hover:ring-2 hover:ring-gray-300"
                        )}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            {image && !imageErrors.has(index) ? (
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="object-cover w-full h-full"
                                    onError={() => handleImageError(index)}
                                />
                            ) : (
                                <span className="text-gray-400 text-xs">No Image</span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
