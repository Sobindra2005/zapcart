import { Router } from 'express';
import {
    searchProducts,
    getSearchSuggestions,
    getPopularSearches,
    rebuildSearchIndex,
    syncEntity
} from '@/controllers/search.controller';

const router = Router();

// Public routes
router.get('/', searchProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/popular', getPopularSearches);

// Admin routes (TODO: Add authentication middleware)
router.post('/rebuild', rebuildSearchIndex);
router.post('/sync', syncEntity);

export default router;
