import { searchIndexQueue } from '@/config/queue';

export class QueueService {
    // Sync product to search index
    static async syncProductToSearchIndex(productId: string) {
        const job = await searchIndexQueue.add('sync-product', {
            type: 'sync-product',
            entityId: productId,
        });
        
        console.log(`📤 Added sync-product job ${job.id} to queue for product ${productId}`);
        return job;
    }

    // Sync category to search index
    static async syncCategoryToSearchIndex(categoryId: string) {
        const job = await searchIndexQueue.add('sync-category', {
            type: 'sync-category',
            entityId: categoryId,
        });
        
        console.log(`📤 Added sync-category job ${job.id} to queue for category ${categoryId}`);
        return job;
    }

    // Rebuild entire search index
    static async rebuildSearchIndex() {
        const job = await searchIndexQueue.add('rebuild-index', {
            type: 'rebuild-index',
        });
        
        console.log(`📤 Added rebuild-index job ${job.id} to queue`);
        return job;
    }
}