import { Router } from 'express';
import {
    getProductReviews,
    getRatingDistribution,
    getReviewById,
    createReview,
    getUserReviews,
    updateReview,
    deleteReview,
    markReviewHelpful,
    markReviewNotHelpful,
    addReplyToReview,
    approveReview,
    rejectReview,
} from '@/controllers/productReview.controller';
import { protect, restrictTo } from '@/middlewares/authMiddleware';
import { upload } from '@/config/multer';

const router = Router();

// Public routes (no authentication required)
router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/stats', getRatingDistribution);
router.get('/:id', getReviewById);

// Protected routes (authentication required)
router.use(protect);

// Authenticated user routes
router.post('/', upload.array('images', 5), createReview);
router.get('/user/me', getUserReviews);
router.put('/:id', upload.array('images', 5), updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markReviewHelpful);
router.post('/:id/not-helpful', markReviewNotHelpful);
router.post('/:id/reply', addReplyToReview);

// Admin/Moderator routes
router.use(restrictTo('admin', 'moderator'));

router.patch('/:id/approve', approveReview);
router.patch('/:id/reject', rejectReview);

export default router;
