import { Worker, Job } from 'bullmq';
import { QueueName } from '@/config/queue';
import { config } from '@/config/env';
import SearchIndex from '@/models/SearchIndex';

const connection = {
    host: config.redisHost,
    port: config.redisPort,
};

interface SearchIndexJobData {
    type: 'sync-product' | 'sync-category' | 'rebuild-index';
    entityId?: string;
}

async function processSearchIndexJob(job: Job<SearchIndexJobData>) {
    console.log(`🔍 Processing search index job ${job.id} of type ${job.data.type}`);

    try {
        switch (job.data.type) {
            case 'sync-product': {
                if (!job.data.entityId) {
                    throw new Error('entityId is required for sync-product');
                }
                await SearchIndex.syncProduct(job.data.entityId);
                console.log(`✅ Synced product ${job.data.entityId} to search index`);
                break;
            }

            case 'sync-category': {
                if (!job.data.entityId) {
                    throw new Error('entityId is required for sync-category');
                }
                await SearchIndex.syncCategory(job.data.entityId);
                console.log(`✅ Synced category ${job.data.entityId} to search index`);
                break;
            }

            case 'rebuild-index': {
                console.log('🔨 Rebuilding entire search index...');
                const result = await SearchIndex.rebuildIndex();
                console.log(`✅ Rebuilt search index:`, {
                    products: `${result.products.synced} synced, ${result.products.failed} failed`,
                    categories: `${result.categories.synced} synced, ${result.categories.failed} failed`,
                    timestamp: result.timestamp
                });

                // Log errors if any
                if (result.products.errors.length > 0) {
                    console.error('Product sync errors:', result.products.errors);
                }
                if (result.categories.errors.length > 0) {
                    console.error('Category sync errors:', result.categories.errors);
                }
                break;
            }
            default: {
                throw new Error(`Unknown job type: ${job.data.type}`);
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error processing search index job ${job.id}:`, errorMessage);
        throw error; // Re-throw to mark job as failed
    }
}

export const searchIndexWorker = new Worker(
    QueueName.SEARCH_INDEX,
    processSearchIndexJob,
    {
        connection,
        concurrency: 5,
        limiter: {
            max: 10,
            duration: 1000,
        },
    }
);

// Event listeners
searchIndexWorker.on('completed', (job) => {
    console.log(`✅ Search index job ${job.id} completed`);
});

searchIndexWorker.on('failed', (job, err) => {
    console.error(`❌ Search index job ${job?.id} failed:`, err.message);
});

searchIndexWorker.on('error', (err) => {
    console.error('❌ Search index worker error:', err);
});
