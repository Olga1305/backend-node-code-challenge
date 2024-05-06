import { createClient } from 'redis';
import { DbClient } from '../DbClient';
import { DbClientError } from '../error/DbClientError';
import config from '../../config/config';

const { REDIS_HOST } = config;

export class RedisDbClient implements DbClient {
    private static instance: RedisDbClient;
    private redisClient;

    constructor() {
        this.redisClient = this.createClient();
    }

    public static getInstance() {
        if (!RedisDbClient.instance) {
            RedisDbClient.instance = new RedisDbClient();
        }

        return RedisDbClient.instance;
    }

    private createClient() {
        console.log('Initializing database connection...');
        const url = 'redis://' + REDIS_HOST;
        const client = createClient({
            url,
        }).on('error', (err) => {
            console.error('Connection to DB pool failed.', err);
            throw new DbClientError('Failed to connect to the DB', { cause: err, context: { db_url: url } });
        });

        return client;
    }

    async connect() {
        if (this.redisClient.isReady) {
            return;
        }
        await this.redisClient.connect();
    }

    async disconnect() {
        await this.redisClient.quit();
    }

    async executeCommand<T>(command: (client: typeof this.redisClient) => Promise<T>): Promise<T> {
        await this.connect();
        return command(this.redisClient);
    }
}
