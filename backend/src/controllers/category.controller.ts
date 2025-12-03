import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler';
import AppError from '@/utils/AppError';
import Category, { ICategory } from '@/models/Category';
import mongoose from 'mongoose';

/**
 * Create a new category
 * POST /api/v1/categories
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, parent, image, icon, color, metaTitle, metaDescription, metaKeywords, displayOrder } = req.body;

    // Validate required fields
    if (!name) {
        throw new AppError('Category name is required', 400);
    }

    // Create category
    const category = await Category.create({
        name,
        description,
        parent: parent || null,
        image,
        icon,
        color,
        metaTitle,
        metaDescription,
        metaKeywords,
        displayOrder: displayOrder || 0,
        isActive: true,
    });

    res.status(201).json({
        status: 'success',
        data: { category },
    });
});

/**
 * Get all categories (flat list)
 * GET /api/v1/categories
 * Optional query params: ?isActive=true&level=0
 */
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const { isActive, level, search } = req.query;

    interface CategoryFilter {
        isActive?: boolean;
        level?: number;
        $text?: { $search: string };
    }

    const filter: CategoryFilter = {};

    // Filter by active status
    if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
    }

    // Filter by level
    if (level !== undefined) {
        filter.level = parseInt(level as string);
    }

    // Search by name or description
    if (search) {
        filter.$text = { $search: search as string };
    }

    const categories = await Category.find(filter)
        .populate('parent', 'name slug')
        .sort({ displayOrder: 1, name: 1 })
        .lean();

    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: { categories },
    });
});

/**
 * Get category tree (hierarchical structure)
 * GET /api/v1/categories/tree
 */
export const getCategoryTree = asyncHandler(async (_req: Request, res: Response) => {
    const tree = await Category.getCategoryTree(null);

    res.status(200).json({
        status: 'success',
        data: { tree },
    });
});

/**
 * Get root categories only
 * GET /api/v1/categories/roots
 */
export const getRootCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.getRootCategories();

    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: { categories },
    });
});

/**
 * Get a single category by ID or slug
 * GET /api/v1/categories/:identifier
 */
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const { identifier } = req.params;
    const { includeChildren } = req.query;

    let category: ICategory | null;

    // Check if identifier is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
        category = await Category.findById(identifier)
            .populate('parent', 'name slug')
            .lean();
    } else {
        // Search by slug
        category = await Category.findOne({ slug: identifier })
            .populate('parent', 'name slug')
            .lean();
    }

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    // Optionally include children
    if (includeChildren === 'true') {
        const children = await Category.find({ parent: category._id, isActive: true })
            .sort({ displayOrder: 1, name: 1 })
            .lean();
        (category as ICategory).children = children;
    }

    res.status(200).json({
        status: 'success',
        data: { category },
    });
});

/**
 * Get category with all descendants
 * GET /api/v1/categories/:id/descendants
 */
export const getCategoryWithDescendants = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    // Get all descendants using ancestors field
    const descendants = await Category.find({
        ancestors: category._id,
    }).sort({ level: 1, displayOrder: 1 });

    res.status(200).json({
        status: 'success',
        data: {
            category,
            descendants,
        },
    });
});

/**
 * Update a category
 * PUT /api/v1/categories/:id
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    // Find category
    const category = await Category.findById(id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    // Update fields
    Object.assign(category, updateData);
    await category.save();

    res.status(200).json({
        status: 'success',
        data: { category },
    });
});

/**
 * Delete a category (soft delete by default)
 * DELETE /api/v1/categories/:id?hard=true
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { hard } = req.query;

    const category = await Category.findById(id);
    if (!category) {
        throw new AppError('Category not found', 404);
    }

    if (hard === 'true') {
        // Hard delete
        await category.deleteOne();
    } else {
        // Soft delete - mark as inactive
        category.isActive = false;
        await category.save();
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * Bulk update categories
 * PATCH /api/v1/categories/bulk
 * Body: { updates: [{ id, data }, { id, data }] }
 */
export const bulkUpdateCategories = asyncHandler(async (req: Request, res: Response) => {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
        throw new AppError('Please provide updates array', 400);
    }

    const results = [];

    for (const update of updates) {
        const { id, data } = update;
        const category = await Category.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (category) {
            results.push(category);
        }
    }

    res.status(200).json({
        status: 'success',
        results: results.length,
        data: { categories: results },
    });
});

/**
 * Bulk delete categories
 * DELETE /api/v1/categories/bulk
 * Body: { ids: [id1, id2, ...], hard: boolean }
 */
export const bulkDeleteCategories = asyncHandler(async (req: Request, res: Response) => {
    const { ids, hard } = req.body;

    if (!ids || !Array.isArray(ids)) {
        throw new AppError('Please provide ids array', 400);
    }

    if (hard) {
        // Hard delete
        await Category.deleteMany({ _id: { $in: ids } });
    } else {
        // Soft delete
        await Category.updateMany(
            { _id: { $in: ids } },
            { isActive: false }
        );
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * Reorder categories (update display order)
 * PATCH /api/v1/categories/reorder
 * Body: { orders: [{ id, displayOrder }, ...] }
 */
export const reorderCategories = asyncHandler(async (req: Request, res: Response) => {
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders)) {
        throw new AppError('Please provide orders array', 400);
    }

    const bulkOps = orders.map(({ id, displayOrder }) => ({
        updateOne: {
            filter: { _id: id },
            update: { displayOrder },
        },
    }));

    await Category.bulkWrite(bulkOps);

    res.status(200).json({
        status: 'success',
        message: 'Categories reordered successfully',
    });
});

/**
 * Update product counts for all categories
 * POST /api/v1/categories/update-counts
 */
export const updateProductCounts = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await Category.find();

    // Import Product model dynamically or use aggregation
    const mongoose = await import('mongoose');
    const Product = mongoose.default.model('Product');

    for (const category of categories) {
        const productCount = await Product.countDocuments({
            category: category._id,
            status: 'active'
        });
        category.productCount = productCount;
        await category.save();
    }

    res.status(200).json({
        status: 'success',
        message: 'Product counts updated successfully',
    });
});
