import { Account } from '../../../../../../../module/bank_account/domain/model/entities/Account';
import { AccountId } from '../../../../../../../module/bank_account/domain/model/value_objects/AccountId';
import { Balance } from '../../../../../../../module/bank_account/domain/model/value_objects/Balance';
import { RedisAccountRepository } from '../../../../../../../module/bank_account/infrastructure/adapters/account_repository/redis/RedisAccountRepository';
import RedisAccountRepositoryError from '../../../../../../../module/bank_account/domain/ports/errors/RedisAccountRepositoryError';

const mockRedisDbClientInstance = {
    executeCommand: jest.fn(),
};
jest.mock('../../../../../../../module/shared/infrastructure/db/redis/RedisDBClient', () => ({
    RedisDbClient: {
        getInstance: () => mockRedisDbClientInstance,
    },
}));

describe('RedisAccountRepository repository implementation unit tests', () => {
    const redisAccountRepository = new RedisAccountRepository();

    const fakeAccountId = new AccountId();
    const fakeAccount = new Account(fakeAccountId, new Balance(500));

    describe('save', () => {
        describe('Given the repo is requested to save an account', () => {
            describe("When there's a Redis error", () => {
                beforeAll(async () => {
                    mockRedisDbClientInstance.executeCommand.mockImplementationOnce(() => {
                        throw new Error();
                    });
                });
                test('Should throw a RedisAccountRepositoryError', async () => {
                    expect.assertions(1);
                    try {
                        await redisAccountRepository.save(fakeAccount);
                    } catch (error) {
                        expect(error).toBeInstanceOf(RedisAccountRepositoryError);
                    }
                });
            });
        });
    });

    describe('findById', () => {
        describe('Given the repo is requested to find an account by Id', () => {
            describe('When the entry is corrupted', () => {
                beforeAll(async () => {
                    mockRedisDbClientInstance.executeCommand.mockImplementationOnce(() => {
                        return { mappingSource: '' };
                    });
                });
                test('Should throw a RedisAccountRepositoryError', async () => {
                    expect.assertions(1);
                    try {
                        await redisAccountRepository.findById(fakeAccountId);
                    } catch (error) {
                        expect(error).toBeInstanceOf(RedisAccountRepositoryError);
                    }
                });
            });
            describe("When there's a Redis error", () => {
                beforeAll(async () => {
                    mockRedisDbClientInstance.executeCommand.mockImplementationOnce(() => {
                        throw new Error();
                    });
                });
                test('Should throw a RedisAccountRepositoryError', async () => {
                    expect.assertions(1);
                    try {
                        await redisAccountRepository.findById(fakeAccountId);
                    } catch (error) {
                        expect(error).toBeInstanceOf(RedisAccountRepositoryError);
                    }
                });
            });
        });
    });

    describe('getAll', () => {
        describe('Given the repo is requested to getAll accounts', () => {
            describe('When there are no entries in the db', () => {
                beforeAll(async () => {
                    mockRedisDbClientInstance.executeCommand.mockImplementationOnce(() => {
                        return [];
                    });
                });
                test('Should return an empty array', async () => {
                    const accounts = await redisAccountRepository.getAll();

                    expect(accounts).toHaveLength(0);
                });
            });
            describe("When there's a Redis error", () => {
                beforeAll(async () => {
                    mockRedisDbClientInstance.executeCommand.mockImplementationOnce(() => {
                        throw new Error();
                    });
                });
                test('Should throw a RedisAccountRepositoryError', async () => {
                    expect.assertions(1);
                    try {
                        await redisAccountRepository.getAll();
                    } catch (error) {
                        expect(error).toBeInstanceOf(RedisAccountRepositoryError);
                    }
                });
            });
        });
    });
});
