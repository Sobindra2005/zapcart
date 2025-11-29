import { Queue, QueueOptions } from 'bullmq';
import { config } from './env';

const connection = {
    host: config.redisHost,
    port: config.redisPort,
};

const defaultQueueOptions: QueueOptions = {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            age: 24 * 3600, 
            count: 1000, 
        },
        removeOnFail: {
            age: 7 * 24 * 3600, 
        },
    },
};

// Queue names
export enum QueueName {
    ORDER_PROCESSING = 'order-processing-queue',
    INVENTORY_SYNC = 'inventory-sync-queue',
    SEARCH_INDEX = 'search-index-queue',
    IMAGE_PROCESSING = 'image-processing-queue',
}

export const orderProcessingQueue = new Queue(QueueName.ORDER_PROCESSING, defaultQueueOptions);
export const inventorySyncQueue = new Queue(QueueName.INVENTORY_SYNC, defaultQueueOptions);
export const searchIndexQueue = new Queue(QueueName.SEARCH_INDEX, defaultQueueOptions);
export const imageProcessingQueue = new Queue(QueueName.IMAGE_PROCESSING, defaultQueueOptions);

export const closeAllQueues = async (): Promise<void> => {
    console.log('🛑 Closing all queues...');
    await Promise.all([
        orderProcessingQueue.close(),
        inventorySyncQueue.close(),
        searchIndexQueue.close(),
        imageProcessingQueue.close(),
    ]);
    console.log('✅ All queues closed');
};

export const queues = {
    orderProcessing: orderProcessingQueue,
    inventorySync: inventorySyncQueue,
    searchIndex: searchIndexQueue,
    imageProcessing: imageProcessingQueue,
};
