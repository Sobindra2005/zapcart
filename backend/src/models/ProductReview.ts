import mongoose, { Schema, Document, Model } from 'mongoose';

// Review Interface
export interface IProductReview extends Document {
  product: mongoose.Types.ObjectId;
  user: number;

  // Review Content
  rating: number;
  comment: string;

  // Media
  images?: string[];

  // Verification
  isVerifiedPurchase: boolean;
  orderId?: number;

  // Helpful votes
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulVotes: number[]; // User IDs who voted helpful
  notHelpfulVotes: number[]; // User IDs who voted not helpful

  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderatorNote?: string;
  moderatedBy?: number;
  moderatedAt?: Date;

  // Reply from seller/admin
  reply?: {
    content: string;
    repliedBy: number;
    repliedAt: Date;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  helpfulnessRatio: number;
  isApproved: boolean;

  // Instance methods
  approve(moderatorId: string, note?: string): Promise<this>;
  reject(moderatorId: string, note: string): Promise<this>;
  addReply(content: string, userId: number): Promise<this>;
  markHelpful(userId: number): Promise<this>;
  markNotHelpful(userId: number): Promise<this>;
}

// Static methods interface
export interface IProductReviewModel extends Model<IProductReview> {
  getProductReviews(
    productId: string,
    options?: {
      limit?: number;
      skip?: number;
      sort?: string;
      rating?: number | null;
      verifiedOnly?: boolean;
    }
  ): Promise<IProductReview[]>;

  getRatingDistribution(productId: string): Promise<{
    distribution: Array<{
      rating: number;
      count: number;
      percentage: number;
    }>;
    totalReviews: number;
  }>;

  getUserReviews(
    userId: number,
    options?: { limit?: number; skip?: number }
  ): Promise<IProductReview[]>;

  hasUserReviewed(userId: number, productId: string): Promise<boolean>;
}

// Product Review Schema
const ProductReviewSchema = new Schema<IProductReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true
    },
    user: {
      type: Number,
      required: [true, 'User reference is required'],
      index: true
    },

    // Review Content
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      index: true
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },

    // Media
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: 'Cannot upload more than 5 images per review'
      }
    },

    // Verification
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    },

    // Helpful votes
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0
    },
    notHelpfulCount: {
      type: Number,
      default: 0,
      min: 0
    },
    helpfulVotes: [{
      type: Number,
    }],
    notHelpfulVotes: [{
      type: Number,
    }],
    // Moderation
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true
    },
    moderatorNote: {
      type: String,
      maxlength: [500, 'Moderator note cannot exceed 500 characters']
    },
    moderatedBy: {
      type: Number,
    },
    moderatedAt: Date,

    // Reply
    reply: {
      content: {
        type: String,
        maxlength: [1000, 'Reply cannot exceed 1000 characters']
      },
      repliedBy: {
        type: Number,
      },
      repliedAt: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes
ProductReviewSchema.index({ product: 1, status: 1, createdAt: -1 });
ProductReviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
ProductReviewSchema.index({ user: 1, createdAt: -1 });
ProductReviewSchema.index({ rating: 1, status: 1 });

// Virtual for calculating helpfulness ratio
ProductReviewSchema.virtual('helpfulnessRatio').get(function () {
  const total = this.helpfulCount + this.notHelpfulCount;
  if (total === 0) return 0;
  return Math.round((this.helpfulCount / total) * 100);
});

// Virtual for checking if review is approved
ProductReviewSchema.virtual('isApproved').get(function () {
  return this.status === 'approved';
});

// Post-save middleware to update product rating
ProductReviewSchema.post('save', async function (doc) {
  if (doc.status === 'approved') {
    const Product = mongoose.model('Product');
    const product = await Product.findById(doc.product);

    if (product) {
      // Recalculate average rating
      const reviews = await mongoose.model('ProductReview').find({
        product: doc.product,
        status: 'approved'
      });

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      product.averageRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
      product.reviewCount = reviews.length;
      await product.save();
    }
  }
});

// Post-remove middleware to update product rating
ProductReviewSchema.post('deleteOne', { document: true, query: false }, async function (doc) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(doc.product);

  if (product) {
    const reviews = await mongoose.model('ProductReview').find({
      product: doc.product,
      status: 'approved'
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    product.averageRating = Math.round(avgRating * 10) / 10;
    product.reviewCount = reviews.length;
    await product.save();
  }
});

// Static method to get reviews for a product
ProductReviewSchema.statics.getProductReviews = function (
  productId: string,
  options: { limit?: number; skip?: number; sort?: string, rating?: number, verifiedOnly?: boolean } = {}
) {
  const {
    limit = 10,
    skip = 0,
    sort = { createdAt: -1 },
    rating = null,
    verifiedOnly = false
  } = options;

  const query: {
    product: string;
    status: string;
    rating?: number;
    isVerifiedPurchase?: boolean
  } = {
    product: productId,
    status: 'approved'
  };

  if (rating) {
    query.rating = rating;
  }

  if (verifiedOnly) {
    query.isVerifiedPurchase = true;
  }

  return this.find(query)
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Static method to get rating distribution for a product
ProductReviewSchema.statics.getRatingDistribution = async function (productId: string) {
  const distribution = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);

  // Create a full distribution (1-5 stars)
  const fullDistribution = [5, 4, 3, 2, 1].map(rating => {
    const found = distribution.find(d => d._id === rating);
    return {
      rating,
      count: found ? found.count : 0
    };
  });

  const totalReviews = fullDistribution.reduce((sum, item) => sum + item.count, 0);

  return {
    distribution: fullDistribution.map(item => ({
      ...item,
      percentage: totalReviews > 0 ? Math.round((item.count / totalReviews) * 100) : 0
    })),
    totalReviews
  };
};

// Static method to get user's reviews
ProductReviewSchema.statics.getUserReviews = function (userId: number, options: { limit?: number; skip?: number } = {}) {
  const { limit = 10, skip = 0 } = options;

  return this.find({ user: userId })
    .populate('product', 'name images slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to check if user has already reviewed a product
ProductReviewSchema.statics.hasUserReviewed = async function (
  userId: number,
  productId: string
) {
  const review = await this.findOne({
    user: userId,
    product: productId
  });

  return !!review;
};

// Instance method to approve review
ProductReviewSchema.methods.approve = async function (moderatorId: string, note?: string) {
  this.status = 'approved';
  this.moderatedBy = new mongoose.Types.ObjectId(moderatorId);
  this.moderatedAt = new Date();
  if (note) this.moderatorNote = note;

  return this.save();
};

// Instance method to reject review
ProductReviewSchema.methods.reject = async function (moderatorId: string, note: string) {
  this.status = 'rejected';
  this.moderatedBy = new mongoose.Types.ObjectId(moderatorId);
  this.moderatedAt = new Date();
  this.moderatorNote = note;

  return this.save();
};

// Instance method to add reply
ProductReviewSchema.methods.addReply = async function (content: string, userId: number) {
  this.reply = {
    content,
    repliedBy: userId,
    repliedAt: new Date()
  };

  return this.save();
};

// Instance method to mark as helpful
ProductReviewSchema.methods.markHelpful = async function (userId: number) {
  const userIdObj = userId;

  // Check if user already voted helpful
  const hasVotedHelpful = this.helpfulVotes.some((id: number) => id === userIdObj);

  if (hasVotedHelpful) {
    return this;
  }

  // Remove from notHelpful if exists
  const notHelpfulIndex = this.notHelpfulVotes.findIndex((id: number) => id === userIdObj);
  if (notHelpfulIndex !== -1) {
    this.notHelpfulVotes.splice(notHelpfulIndex, 1);
    this.notHelpfulCount = Math.max(0, this.notHelpfulCount - 1);
  }

  this.helpfulVotes.push(userIdObj);
  this.helpfulCount += 1;
  await this.save();

  return this;
};

// Instance method to mark as not helpful
ProductReviewSchema.methods.markNotHelpful = async function (userId: number) {
  const userIdObj = userId;

  // Check if user already voted not helpful
  const hasVotedNotHelpful = this.notHelpfulVotes.some((id: number) => id === userIdObj);

  if (hasVotedNotHelpful) {
    return this;
  }

  const helpfulIndex = this.helpfulVotes.findIndex((id: number) => id === userIdObj);
  if (helpfulIndex !== -1) {
    this.helpfulVotes.splice(helpfulIndex, 1);
    this.helpfulCount = Math.max(0, this.helpfulCount - 1);
  }

  this.notHelpfulVotes.push(userIdObj);
  this.notHelpfulCount += 1;
  await this.save();

  return this;
};


// Model
const ProductReview = mongoose.model<IProductReview, IProductReviewModel>(
  'ProductReview',
  ProductReviewSchema
);

export default ProductReview;
