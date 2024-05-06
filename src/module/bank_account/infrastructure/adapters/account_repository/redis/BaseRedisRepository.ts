import { CustomError } from '../../../../../shared/domain/error/CustomError';
import { RedisDbClient } from '../../../../../shared/infrastructure/db/redis/RedisDBClient';
import BaseRedisRepositoryError from '../../../../domain/ports/errors/BaseRedisRepositoryError';

interface EntityIdConstraint {
    value: string;
}

export abstract class BaseRedisRepository<Entity, EntityId extends EntityIdConstraint> {
    protected readonly setName: string;
    protected readonly redisDbClient: RedisDbClient;

    constructor(setName: string) {
        this.redisDbClient = RedisDbClient.getInstance();
        this.setName = setName;
    }

    async save(entity: Entity): Promise<void> {
        const id = this.getIdValue(entity);
        try {
            console.log(`Saving ${this.setName} with id: ${id}`);

            await this.redisDbClient.executeCommand((connectedClient) => {
                const hashKey = `${this.setName}:${id}`;
                const transaction = connectedClient.multi().sAdd(this.setName, id).hSet(hashKey, this.serialize(entity));
                return transaction.exec();
            });
        } catch (error) {
            const errorMessage = `Failed to save a new ${this.setName} with id: ${id}`;
            const errorOptions = { cause: error, context: { entity } };
            const customError = this.getError(errorMessage, errorOptions);
            throw customError;
        }
    }

    async findById(id: EntityId): Promise<Entity | null> {
        try {
            console.log(`Finding ${this.setName} with id: ${id.value}`);

            const redisStoredHash = await this.redisDbClient.executeCommand(async (connectedClient) => connectedClient.hGetAll(`${this.setName}:${id.value}`));

            if (Object.keys(redisStoredHash).length) {
                return this.deserialize(redisStoredHash);
            }

            return null;
        } catch (error) {
            const errorMessage = `Failed to find the requested ${this.setName} with id: ${id.value}`;
            const errorOptions = { cause: error, context: { id: id.value } };
            const customError = this.getError(errorMessage, errorOptions);
            throw customError;
        }
    }

    async getAll(): Promise<Array<Entity>> {
        try {
            console.log(`Getting all ${this.setName}`);

            const executeCommandResult = await this.redisDbClient.executeCommand(async (connectedClient) => {
                const setMembers = await connectedClient.sMembers(this.setName);
                return Promise.allSettled(setMembers.map((idValue) => this.findById(this.createIdFromValue(idValue))));
            });

            const failedResults: Array<PromiseRejectedResult> = [];
            const successfulResults: Array<Entity> = [];
            for (const item of executeCommandResult) {
                if (isRejectedPromise(item)) {
                    failedResults.push(item.reason);
                } else if (item.value) {
                    successfulResults.push(item.value);
                }
            }
            if (failedResults.length) {
                if (failedResults.length === executeCommandResult.length) {
                    const errorMessage = `Failed to get all ${this.setName}`;
                    const errorOptions = { cause: failedResults };
                    const customError = this.getError(errorMessage, errorOptions);
                    throw customError;
                }
                console.error(`Some ${this.setName} failed to be retrieved`, { failedResults });
            }

            return successfulResults;
        } catch (error) {
            if (error instanceof BaseRedisRepositoryError) {
                throw error;
            }
            const errorMessage = `Failed to get all ${this.setName}`;
            const errorOptions = { cause: error };
            const customError = this.getError(errorMessage, errorOptions);
            throw customError;
        }
    }

    async delete(id: EntityId): Promise<void> {
        try {
            console.log(`Deleting ${this.setName} with id: ${id.value}`);

            await this.redisDbClient.executeCommand((connectedClient) => connectedClient.multi().sRem(`${this.setName}`, `${id.value}`).del(`${this.setName}:${id.value}`).exec());
        } catch (error) {
            const errorMessage = `Failed to delete ${this.setName} with id: ${id.value}`;
            const errorOptions = { cause: error, context: { id: id.value } };
            const customError = this.getError(errorMessage, errorOptions);
            throw customError;
        }
    }

    abstract getIdValue(entity: Entity): string;

    abstract createIdFromValue(value: string): EntityId;

    abstract serialize(entity: Entity): RedisStoredHash;

    abstract deserialize(storedHash: RedisStoredHash): Entity;

    abstract getError(errorMessage: string, errorOptions: Record<string, unknown>): CustomError;
}

function isRejectedPromise<T>(prm: PromiseSettledResult<T>): prm is PromiseRejectedResult {
    return prm.status === 'rejected';
}

export type RedisStoredHash = { [x: string]: string };
