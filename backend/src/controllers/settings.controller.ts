import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import { redis } from '@/config/redis';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';

export const DELIVERY_ESTIMATE_KEY = 'ESTIMATED_DELIVERY_DAYS';
export const REDIS_DELIVERY_KEY = 'system:delivery_days';
const REDIS_ALL_SETTINGS_KEY = 'system:all_settings';

/**
 * Get All System Settings
 * GET /api/v1/settings
 */
export const getAllSystemSettings = asyncHandler(async (_req: Request, res: Response) => {
    // Try Redis first
    const redisClient = redis.getClient();
    let settings = null;

    if (redisClient) {
        const cachedSettings = await redisClient.get(REDIS_ALL_SETTINGS_KEY);
        if (cachedSettings) {
            settings = JSON.parse(cachedSettings);
        }
    }

    // Fallback to DB
    if (!settings) {
        settings = await prisma.systemSetting.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Cache it
        if (redisClient) {
            await redisClient.set(REDIS_ALL_SETTINGS_KEY, JSON.stringify(settings));
        }
    }

    res.status(200).json({
        status: 'success',
        results: settings.length,
        data: {
            settings,
        },
    });
});

/**
 * Add or Update System Setting (Generic)
 * POST /api/v1/settings
 */
export const addSystemSetting = asyncHandler(async (req: Request, res: Response) => {
    const { key, value, description } = req.body;

    if (!key || !value) {
        throw new AppError('Please provide both key and value', 400);
    }

    // 1. Update/Create in Database
    const setting = await prisma.systemSetting.upsert({
        where: { key },
        update: { value, ...(description && { description }) },
        create: {
            key,
            value,
            description: description || '',
        },
    });

    // 2. Update Redis Cache
    const redisClient = redis.getClient();
    if (redisClient) {
        await redisClient.set(`system:${key}`, value);
        // Invalidate the all settings cache
        await redisClient.del(REDIS_ALL_SETTINGS_KEY);
    }

    res.status(201).json({
        status: 'success',
        data: {
            setting,
        },
    });
});

/**
 * Update Estimated Delivery Time (Admin Only)
 * PUT /api/v1/settings/delivery-estimate
 */
export const updateDeliveryEstimate = asyncHandler(async (req: Request, res: Response) => {
    const { days } = req.body;

    if (!days || isNaN(Number(days))) {
        throw new AppError('Please provide a valid number of days', 400);
    }

    const value = String(days);

    // 1. Update Database
    const setting = await prisma.systemSetting.upsert({
        where: { key: DELIVERY_ESTIMATE_KEY },
        update: { value },
        create: {
            key: DELIVERY_ESTIMATE_KEY,
            value,
            description: 'Default estimated delivery time in days',
        },
    });

    // 2. Update Redis Cache
    const redisClient = redis.getClient();
    if (redisClient) {
        await redisClient.set(REDIS_DELIVERY_KEY, value);
        // Invalidate the all settings cache
        await redisClient.del(REDIS_ALL_SETTINGS_KEY);
    }

    res.status(200).json({
        status: 'success',
        data: {
            setting,
        },
    });
});

/**
 * Get Estimated Delivery Time
 * GET /api/v1/settings/delivery-estimate
 */
export const getDeliveryEstimate = asyncHandler(async (_req: Request, res: Response) => {
    // Try Redis first
    const redisClient = redis.getClient();
    let days = null;

    if (redisClient) {
        days = await redisClient.get(REDIS_DELIVERY_KEY);
    }

    // Fallback to DB
    if (!days) {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: DELIVERY_ESTIMATE_KEY },
        });
        days = setting?.value || '5'; // Default to 5 days if not set

        // Cache it
        if (redisClient) {
            await redisClient.set(REDIS_DELIVERY_KEY, days);
        }
    }

    res.status(200).json({
        status: 'success',
        data: {
            days: Number(days),
        },
    });
});
