import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler';
import AppError from '@/utils/AppError';
import SearchIndex from '@/models/SearchIndex';
import { QueueService } from 'service/queueService/searchIndexService';

interface SearchFilters {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    tags?: string[];
}

interface SortOptions {
    [key: string]: number | undefined;
    popularity?: number;
    rating?: number;
    price?: number;
}


/**
 * Search products and categories
 * GET /api/v1/search?q=query&entityType=product&page=1&limit=20
 */
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const {
        q,
        entityType,
        page = 1,
        limit = 20,
        brand,
        category,
        minPrice,
        maxPrice,
        minRating,
        tags,
        sort
    } = req.query;

    if (!q) {
        throw new AppError('Please provide a search query (q parameter)', 400);
    }

    // Build filters
    const filters: SearchFilters = {};
    if (brand) filters.brand = brand as string;
    if (category) filters.category = category as string;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (minRating) filters.minRating = Number(minRating);
    if (tags) filters.tags = Array.isArray(tags) ? tags as string[] : [tags as string];

    // Build sort
    let sortOptions: SortOptions = { popularity: -1, rating: -1 };
    if (sort === 'price-asc') {
        sortOptions = { price: 1, popularity: -1 };
    } else if (sort === 'price-desc') {
        sortOptions = { price: -1, popularity: -1 };
    } else if (sort === 'rating') {
        sortOptions = { rating: -1, popularity: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Validate entityType
    const validEntityType = entityType === 'product' || entityType === 'category' ? entityType : null;

    const searchResults = await SearchIndex.search(q as string, {
        entityType: validEntityType,
        limit: Number(limit),
        skip,
        filters,
        sort: sortOptions
    });

    res.status(200).json({
        status: 'success',
        results: searchResults.results.length,
        total: searchResults.total,
        page: searchResults.page,
        totalPages: searchResults.totalPages,
        data: {
            results: searchResults.results
        }
    });
});

/**
 * Get search suggestions/autocomplete
 * GET /api/v1/search/suggestions?q=sam
 */
export const getSearchSuggestions = asyncHandler(async (req: Request, res: Response) => {
    const { q, limit = 5 } = req.query;

    if (!q) {
        throw new AppError('Please provide a search query (q parameter)', 400);
    }

    const suggestions = await SearchIndex.getSuggestions(q as string, Number(limit));

    res.status(200).json({
        status: 'success',
        results: suggestions.length,
        data: { suggestions }
    });
});

/**
 * Get popular products/categories
 * GET /api/v1/search/popular?entityType=product&limit=10
 */
export const getPopularSearches = asyncHandler(async (req: Request, res: Response) => {
    const { entityType = 'product', limit = 10 } = req.query;

    const popular = await SearchIndex.getPopular(entityType as string, Number(limit));

    res.status(200).json({
        status: 'success',
        results: popular.length,
        data: {
            popular,
            entityType
        }
    });
});

/**
 * Rebuild entire search index (ADMIN ONLY)
 * POST /api/v1/search/rebuild
 */
export const rebuildSearchIndex = asyncHandler(async (_req: Request, res: Response) => {
    // Queue the rebuild job
    const job = await QueueService.rebuildSearchIndex();

    res.status(202).json({
        status: 'success',
        message: 'Search index rebuild job has been queued',
        data: {
            jobId: job.id,
            jobName: job.name
        }
    });
});

/**
 * Manually sync a single entity (ADMIN ONLY)
 * POST /api/v1/search/sync
 * Body: { entityType: 'product' | 'category', entityId: string }
 */
export const syncEntity = asyncHandler(async (req: Request, res: Response) => {
    const { entityType, entityId } = req.body;

    if (!entityType || !entityId) {
        throw new AppError('Please provide entityType and entityId', 400);
    }

    if (entityType !== 'product' && entityType !== 'category') {
        throw new AppError('entityType must be either "product" or "category"', 400);
    }

    let job;
    if (entityType === 'product') {
        job = await QueueService.syncProductToSearchIndex(entityId);
    } else {
        job = await QueueService.syncCategoryToSearchIndex(entityId);
    }

    res.status(202).json({
        status: 'success',
        message: `Sync job for ${entityType} ${entityId} has been queued`,
        data: {
            jobId: job.id,
            jobName: job.name,
            entityType,
            entityId
        }
    });
});
