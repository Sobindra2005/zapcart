"use client";

import { useState } from "react";
import { IProductReview } from "@/types/productReviews";
import { Star, ThumbsUp, ThumbsDown, BadgeCheck, MessageSquare, Image as ImageIcon, X, Edit, Trash2, Upload } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import { cn } from "@repo/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@repo/ui/ui/textarea";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { reviewsApi } from "@/utils/api";

import { toast } from "sonner";
import { getQueryClient } from "../../../packages/ui/src/get-query-client";

interface ReviewCardProps {
    review: IProductReview;
    onVoteHelpful?: (reviewId: string, voteType: 'helpful' | 'notHelpful') => void;
    authorReview?: boolean;
}

export function ReviewCard({ review, onVoteHelpful, authorReview }: ReviewCardProps) {
    const [userVote, setUserVote] = useState<'helpful' | 'notHelpful' | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Edit mode state grouped
    const [editState, setEditState] = useState({
        rating: review.rating,
        comment: review.comment,
        existingImages: review.images || [],
        newImageFiles: [] as File[],
        newImagePreviews: [] as string[]
    });

    // Optimistic UI counts
    const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
    const [notHelpfulCount, setNotHelpfulCount] = useState(review.notHelpfulCount);

    const queryClient = getQueryClient();

    // Update review mutation
    const updateReviewMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append('rating', editState.rating.toString());
            formData.append('comment', editState.comment);

            // Add existing images that weren't removed
            editState.existingImages.forEach((img) => {
                formData.append('existingImages', img);
            });

            console.log('Editing review with data:',  editState.existingImages)

            // Add new images
            editState.newImageFiles.forEach((file) => {
                formData.append('images', file);
            });

            return reviewsApi.editReview(review.id, formData);
        },
        onSuccess: () => {
            // Get product ID from review
            const productId = review.product

            // Invalidate queries to refetch updated data
            queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });

            // Clean up image previews
            editState.newImagePreviews.forEach(url => URL.revokeObjectURL(url));

            setIsEditing(false);
            setEditState(prev => ({
                ...prev,
                newImageFiles: [],
                newImagePreviews: []
            }));

            toast.success('Review updated successfully');
        },
        onError: (error: any) => {
            console.error('Error updating review:', error);
            toast.error(error?.response?.data?.message || 'Failed to update review');
        }
    });

    const deleteReviewMutation = useMutation({
        mutationFn: () => reviewsApi.deleteReview(review.id),
        onSuccess: () => {
            const productId = review.product

            queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
            queryClient.invalidateQueries({ queryKey: ['product', productId] });

            toast.success('Review deleted successfully');
        },
        onError: (error: any) => {
            console.error('Error deleting review:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete review');
        }
    });

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleVote = (voteType: 'helpful' | 'notHelpful') => {
        if (userVote === voteType) {
            setUserVote(null);
            if (voteType === 'helpful') {
                setHelpfulCount(prev => Math.max(0, prev - 1));
            } else {
                setNotHelpfulCount(prev => Math.max(0, prev - 1));
            }
        } else {
            // Add new vote or switch vote
            if (userVote === 'helpful') {
                setHelpfulCount(prev => Math.max(0, prev - 1));
                setNotHelpfulCount(prev => prev + 1);
            } else if (userVote === 'notHelpful') {
                setNotHelpfulCount(prev => Math.max(0, prev - 1));
                setHelpfulCount(prev => prev + 1);
            } else {
                // First vote
                if (voteType === 'helpful') {
                    setHelpfulCount(prev => prev + 1);
                } else {
                    setNotHelpfulCount(prev => prev + 1);
                }
            }
            setUserVote(voteType);
            onVoteHelpful?.(review.id, voteType);
        }
    };

    const formatDate = (date: Date) => {
        try {
            return format(new Date(date), 'MMM dd, yyyy');
        } catch {
            return new Date(date).toLocaleDateString();
        }
    };

    const handleEditReview = () => {
        setIsEditing(true);
        setEditState({
            rating: review.rating,
            comment: review.comment,
            existingImages: review.images || [],
            newImageFiles: [],
            newImagePreviews: []
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditState({
            rating: review.rating,
            comment: review.comment,
            existingImages: review.images || [],
            newImageFiles: [],
            newImagePreviews: []
        });
    };

    const handleSaveEdit = async () => {
        if (editState.comment.trim().length < 10) {
            toast.error('Review must be at least 10 characters');
            return;
        }

        if (editState.rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        updateReviewMutation.mutate();
    };

    const handleRemoveExistingImage = (imageUrl: string) => {
        setEditState(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter(img => img !== imageUrl)
        }));
    };

    const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const totalImages = editState.existingImages.length + editState.newImageFiles.length + files.length;
        if (totalImages > 5) {
            alert("Maximum 5 images allowed");
            return;
        }

        const previews = files.map(file => URL.createObjectURL(file));
        setEditState(prev => ({
            ...prev,
            newImageFiles: [...prev.newImageFiles, ...files],
            newImagePreviews: [...prev.newImagePreviews, ...previews]
        }));
    };

    const handleRemoveNewImage = (index: number) => {
        URL.revokeObjectURL(editState.newImagePreviews[index]);
        setEditState(prev => ({
            ...prev,
            newImageFiles: prev.newImageFiles.filter((_, i) => i !== index),
            newImagePreviews: prev.newImagePreviews.filter((_, i) => i !== index)
        }));
    };

    const handleDeleteReview = () => {
        if (confirm("Are you sure you want to delete this review?")) {
            deleteReviewMutation.mutate();
        }
    };

    return (
        <div className={cn(
            "py-6 border rounded-lg p-6 mb-4",
            authorReview ? "bg-blue-50 border-blue-200" : "bg-gray-50"
        )}>
            <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                    {review?.user?.avatar ? (
                        <img
                            src={review.user.avatar}
                            alt={review.user.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-white">
                            {review?.user ? getInitials(review.user.name || "Anonymous User") : "AU"}
                        </span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{review?.user ? review.user.name : "Anonymous"}</h4>
                            {authorReview && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                    Your Review
                                </span>
                            )}
                            {review.isVerifiedPurchase && (
                                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                    <BadgeCheck className="w-4 h-4" />
                                    <span>Verified Purchase</span>
                                </div>
                            )}
                        </div>
                        {authorReview && !isEditing && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEditReview}
                                    className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDeleteReview}
                                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</span>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-300 text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {isEditing ? (
                // Edit Mode
                <div className="ml-16 space-y-4">
                    {/* Rating Edit */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setEditState(prev => ({ ...prev, rating: star }))}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            "w-6 h-6 cursor-pointer transition-colors",
                                            star <= editState.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-300 text-gray-300 hover:fill-yellow-200 hover:text-yellow-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment Edit */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Your Review</label>
                        <Textarea
                            value={editState.comment}
                            onChange={(e) => setEditState(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Share your experience with this product..."
                            className="min-h-24 resize-none"
                        />
                    </div>

                    {/* Images Edit */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Images</label>

                        {/* Existing Images */}
                        {editState.existingImages.length > 0 && (
                            <div className="flex gap-2 flex-wrap mb-3">
                                {editState.existingImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Review image ${idx + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(img)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Images Preview */}
                        {editState.newImagePreviews.length > 0 && (
                            <div className="flex gap-2 flex-wrap mb-3">
                                {editState.newImagePreviews.map((preview, idx) => (
                                    <div key={idx} className="relative group">
                                        <Image
                                            src={preview}
                                            alt={`New image ${idx + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(idx)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        {(editState.existingImages.length + editState.newImageFiles.length) < 5 && (
                            <div>
                                <label
                                    htmlFor={`edit-images-${review.id}`}
                                    className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted transition-colors w-fit"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span className="text-sm">Upload Images</span>
                                </label>
                                <input
                                    id={`edit-images-${review.id}`}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleNewImageSelect}
                                    className="hidden"
                                />
                                <span className="text-xs text-muted-foreground mt-1 block">
                                    Max 5 images (Current: {editState.existingImages.length + editState.newImageFiles.length})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={handleSaveEdit}
                            size="sm"
                            disabled={updateReviewMutation.isPending}
                        >
                            {updateReviewMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                            disabled={updateReviewMutation.isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                // View Mode
                <div>
                    {review.title && (
                        <h5 className="font-semibold text-base mb-2 ml-16">{review.title}</h5>
                    )}

                    <p className="text-sm text-gray-600 leading-relaxed ml-16 mb-4">{review.comment}</p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                        <div className="ml-16 mb-4">
                            <div className="flex gap-2 flex-wrap">
                                {review.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Review image ${idx + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => setPreviewImage(img)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Close preview"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <img
                        src={previewImage}
                        alt="Review image preview"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Helpful Votes */}
            {!authorReview && !isEditing && (
                <div className="ml-16 flex items-center gap-4 pt-3 border-t">
                    <span className="text-sm text-muted-foreground">Was this helpful?</span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote('helpful')}
                            className={cn(
                                "h-8 px-3 gap-1.5 transition-all",
                                userVote === 'helpful' && "bg-green-50 border-green-600 text-green-600"
                            )}
                        >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{helpfulCount}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote('notHelpful')}
                            className={cn(
                                "h-8 px-3 gap-1.5 transition-all",
                                userVote === 'notHelpful' && "bg-red-50 border-red-600 text-red-600"
                            )}
                        >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{notHelpfulCount}</span>
                        </Button>
                    </div>
                    {review.helpfulnessRatio > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {Math.round(review.helpfulnessRatio)}% found this helpful
                        </span>
                    )}
                </div>
            )}

            {/* Seller/Admin Reply */}
            {review.reply && !isEditing && (
                <div className="ml-16 mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-blue-900">{review.reply.repliedBy.name}</span>
                                <span className="text-xs text-blue-600">responded</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(review.reply.repliedAt)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{review.reply.content}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}