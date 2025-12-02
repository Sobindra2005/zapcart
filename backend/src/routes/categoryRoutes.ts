import { Router } from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryTree,
    getRootCategories,
    getCategoryById,
    getCategoryWithDescendants,
    updateCategory,
    deleteCategory,
    bulkUpdateCategories,
    bulkDeleteCategories,
    reorderCategories,
    updateProductCounts,
} from '@/controllers/category.controller';
import { protect, restrictTo } from '@/middlewares/authMiddleware';

const router = Router();

// Public routes (no authentication required)
router.get('/tree', getCategoryTree);
router.get('/roots', getRootCategories);
router.get('/:identifier', getCategoryById);
router.get('/:id/descendants', getCategoryWithDescendants);

// Admin routes (authentication + admin role required)
router.use(protect); // All routes below require authentication
router.use(restrictTo('admin')); // All routes below require admin role

router.post('/', createCategory);
router.get('/', getAllCategories); // Admin can see all, including inactive
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// Bulk operations
router.patch('/bulk', bulkUpdateCategories);
router.delete('/bulk', bulkDeleteCategories);

// Special operations
router.patch('/reorder', reorderCategories);
router.post('/update-counts', updateProductCounts);

export default router;
