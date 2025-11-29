import Redis, { RedisOptions } from 'ioredis';
import { config } from './env';

interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    maxRetriesPerRequest: number;
    retryStrategy: (times: number) => number | void;
    enableReadyCheck: boolean;
    enableOfflineQueue: boolean;
}

export class RedisConnection {
    private static instance: RedisConnection;
    private client: Redis | null = null;
    private isConnected: boolean = false;
    private config: RedisConfig;

    private constructor() {
        this.config = {
            host: config.redisHost,
            port: config.redisPort,
            maxRetriesPerRequest: 3,
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            enableReadyCheck: true,
            enableOfflineQueue: false,
        };
    }

    public static getInstance(): RedisConnection {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new RedisConnection();
        }
        return RedisConnection.instance;
    }

    public async connect(): Promise<Redis> {
        if (this.isConnected && this.client) {
            return this.client;
        }

        try {
            this.client = new Redis(this.config as RedisOptions);
            
            // Wait for connection
            await new Promise<void>((resolve, reject) => {
                if (!this.client) return reject(new Error('Redis client not initialized'));
                
                this.client.once('ready', () => {
                    this.isConnected = true;
                    console.log('✅ Redis connected successfully');
                    resolve();
                });
                
                this.client.once('error', (error) => {
                    console.error('❌ Redis connection error:', error);
                    reject(error);
                });
            });

            return this.client;
        } catch (error) {
            console.error('❌ Failed to connect to Redis:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            if (this.client && this.isConnected) {
                await this.client.quit();
                this.isConnected = false;
                this.client = null;
                console.log('🔌 Redis disconnected');
            }
        } catch (error) {
            console.error('❌ Redis disconnection error:', error);
            throw error;
        }
    }

    public getClient(): Redis | null {
        return this.client;
    }

    public isHealthy(): boolean {
        return this.isConnected && this.client?.status === 'ready';
    }

    public async healthCheck(): Promise<boolean> {
        try {
            if (!this.client) return false;
            await this.client.ping();
            return true;
        } catch (error) {
            console.error('❌ Redis health check failed:', error);
            return false;
        }
    }
}

// Export singleton instance
export const redis = RedisConnection.getInstance();

// Convenience functions
export const connectRedis = () => redis.connect();
export const disconnectRedis = () => redis.disconnect();
export const getRedisClient = () => redis.getClient();