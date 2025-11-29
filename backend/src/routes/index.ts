import express from 'express';
import { QueueService } from 'service/queueService/searchIndexService';

const router = express.Router();

/**
 * Central route configuration
 * Mount all route modules here
 */
router.get('/', async (req, res) => {
    console.log(`here is the ${req}`)
    await QueueService.syncProductToSearchIndex('sample-product-id');
    return res.status(200).json({ message: 'syncing product to search index' });
})

export default router;
