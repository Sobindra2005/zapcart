"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { ReviewCard } from "./ReviewCard";
import { Button } from "@repo/ui/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/ui/form";
import { Textarea } from "@repo/ui/ui/textarea";
import { cn } from "@repo/lib/utils";
import { motion } from "framer-motion"
import { useQuery, useMutation } from "@tanstack/react-query";
import { reviewsApi } from "@/utils/api";
import { getQueryClient } from "../../../packages/ui/src/get-query-client";
import { Product } from "@/types/product";
import { IProductReview } from "@/types/productReviews";
import {  selectUserId, useUserStore } from "@/stores";
import { SectionHeader } from "./SectionHeader";

// Review form validation schema
const reviewSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5),
    comment: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must be less than 500 characters"),
    images: z.array(z.string()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewsSectionProps {
    productId: string;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
            images: [],
        },
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newFiles = [...selectedImages, ...files].slice(0, 5);
        setSelectedImages(newFiles);

        // Create preview URLs
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        // Revoke the URL to free memory
        URL.revokeObjectURL(imagePreviews[index]);

        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
    };

    const { data } = useQuery({
        queryKey: ['productReviews', productId],
        queryFn: () => reviewsApi.getReviewsByProductId(productId)
    })

    const queryClient = getQueryClient();

    const product = queryClient.getQueryData<{ data: { product: Product } }>(['product', productId])?.data.product as Product;

    const reviewCount = data?.data.reviews.length || 0;
    const reviews: IProductReview[] = data?.data.reviews || [];

    const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.rating === stars).length;
        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
        return { stars, count, percentage };
    });

    const userId = selectUserId(useUserStore())

    const createReviewMutation = useMutation({
        mutationFn: reviewsApi.createReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });

            imagePreviews.forEach(url => URL.revokeObjectURL(url));

            form.reset();
            setShowReviewForm(false);
            setSelectedImages([]);
            setImagePreviews([]);
        },
        onError: (error) => {
            console.error("Error submitting review:", error);
        }
    });

    const handleSubmitReview = async (data: ReviewFormData) => {
        const formData = new FormData();
        formData.append('product', productId);
        formData.append('rating', data.rating.toString());
        formData.append('comment', data.comment);

        selectedImages.forEach((file) => {
            formData.append('images', file);
        });

        createReviewMutation.mutate(formData);
    };

    const markHelpfulMutation = useMutation({
        mutationFn: ({ reviewId, voteType }: { reviewId: string; voteType: 'helpful' | 'notHelpful' }) => {
            return voteType === 'helpful'
                ? reviewsApi.markHelpful(reviewId)
                : reviewsApi.markNotHelpful(reviewId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
        },
        onError: (error) => {
            console.error("Error voting on review:", error);
        }
    });

    const handleVoteHelpful = (reviewId: string, voteType: 'helpful' | 'notHelpful') => {
        markHelpfulMutation.mutate({ reviewId, voteType });
    };

    return (
        <div >
            <SectionHeader title="Rating & Reviews" viewAllLink="" />

            <div className="grid md:grid-cols-2 gap-12 px-4">
                {/* Rating Summary */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-6xl font-bold">{product.averageRating.toFixed(1)}</span>
                            <span className="text-2xl text-muted-foreground">/5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">({reviewCount} Reviews)</p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                        {ratingBreakdown.map(({ stars, percentage }) => (
                            <div key={stars} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-20">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${i < stars
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-300 text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-muted-foreground w-10 text-right">
                                    {Math.round(percentage)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-0 w-full">
                    <Button
                        className="h-12 mx-auto rounded-full bg-black text-white font-medium hover:bg-black/90 mb-6"
                        size="lg"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                        {showReviewForm ? "Cancel" : "Add Your Review"}
                    </Button>

                    {/* Review Form */}
                    {showReviewForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Write a Review</h3>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-4">
                                    {/* Rating Field */}
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rating *</FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => field.onChange(star)}
                                                                className="transition-transform hover:scale-110"
                                                            >
                                                                <Star
                                                                    className={cn(
                                                                        "w-8 h-8 cursor-pointer transition-colors",
                                                                        star <= field.value
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "fill-gray-300 text-gray-300 hover:fill-yellow-200 hover:text-yellow-200"
                                                                    )}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Comment Field */}
                                    <FormField
                                        control={form.control}
                                        name="comment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Review *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Share your experience with this product..."
                                                        className="min-h-30 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Image Upload Field */}
                                    <FormField
                                        control={form.control}
                                        name="images"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Images (Optional)</FormLabel>
                                                <FormControl>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <label
                                                                htmlFor="review-images"
                                                                className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted transition-colors"
                                                            >
                                                                <Upload className="w-4 h-4" />
                                                                <span className="text-sm">Upload Images</span>
                                                            </label>
                                                            <input
                                                                id="review-images"
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handleImageSelect}
                                                                className="hidden"
                                                            />
                                                            <span className="text-xs text-muted-foreground">
                                                                Max 5 images
                                                            </span>
                                                        </div>

                                                        {/* Image Previews */}
                                                        {imagePreviews.length > 0 && (
                                                            <div className="grid grid-cols-5 gap-3">
                                                                {imagePreviews.map((preview, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                                                                    >
                                                                        <Image
                                                                            src={preview}
                                                                            alt={`Preview ${index + 1}`}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveImage(index)}
                                                                            className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button type="submit" disabled={createReviewMutation.isPending}>
                                            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </motion.div>
                    )}

                    <div className="space-y-0">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <ReviewCard
                                    authorReview={userId === review.user.id}
                                    key={review.id}
                                    review={review}
                                    onVoteHelpful={handleVoteHelpful}
                                />
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-8">
                                No reviews yet. Be the first to review this product!
                            </p>
                        )}
                    </div>

                    {reviews.length > 0 && (
                        <div className="flex justify-center pt-6">
                            <Button
                                variant="outline"
                                className="rounded-full px-8 h-12 font-medium"
                            >
                                View More Reviews
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
