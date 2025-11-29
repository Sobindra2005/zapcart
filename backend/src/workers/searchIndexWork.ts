import { Worker, Job } from 'bullmq';
import { QueueName } from '@/config/queue';
import { config } from '@/config/env';

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
