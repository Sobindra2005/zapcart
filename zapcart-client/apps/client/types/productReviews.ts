
interface productUser {
    id: number;
    name: string;
    avatar?: string;
}

export interface IProductReview {
    _id: string;
    id: string;
    product: string;
    user: productUser;

    // Review Content
    rating: number;
    title?: string;
    comment: string;

    // Media
    images?: string[];

    // Verification
    isVerifiedPurchase: boolean;
    orderId?: number;

    // Helpful votes
    helpfulCount: number;
    notHelpfulCount: number;
    helpfulVotes: productUser[];
    notHelpfulVotes: productUser[];

    // Moderation
    status: 'pending' | 'approved' | 'rejected';
    moderatorNote?: string;
    moderatedBy?: productUser;
    moderatedAt?: Date;

    // Reply from seller/admin
    reply?: {
        content: string;
        repliedBy: productUser;
        repliedAt: Date;
    };

    // Timestamps
    createdAt: Date;
    updatedAt: Date;

    // Virtuals
    helpfulnessRatio: number;
    isApproved: boolean;
}

export type ProductReview = IProductReview;