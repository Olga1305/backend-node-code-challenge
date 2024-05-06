import { RedisDbClient } from '../../../../../module/shared/infrastructure/db/redis/RedisDBClient';
import { RedisAccountRepository } from '../../../../../module/bank_account/infrastructure/adapters/account_repository/redis/RedisAccountRepository';
import { Account } from '../../../../../module/bank_account/domain/model/entities/Account';
import { AccountId } from '../../../../../module/bank_account/domain/model/value_objects/AccountId';
import { Balance } from '../../../../../module/bank_account/domain/model/value_objects/Balance';

describe('RedisAccountRepository repository implementation', () => {
    const redisAccountRepository = new RedisAccountRepository();
    const redisClient = RedisDbClient.getInstance();

    const fakeAccountId = new AccountId();
    const fakeAccount = new Account(fakeAccountId, new Balance(500));

    let addedAccount: Account | null;
    let foundedAccounts: Array<Account>;
    let deletedFlightPILMock: Account | null;
    let emptyResult: Array<Account>;

    beforeAll(async () => {
        await redisClient.executeCommand((connectedClient) => connectedClient.flushAll());
        await redisAccountRepository.save(fakeAccount);
        addedAccount = await redisAccountRepository.findById(fakeAccountId);
        foundedAccounts = await redisAccountRepository.getAll();
        await redisAccountRepository.delete(fakeAccountId);
        deletedFlightPILMock = await redisAccountRepository.findById(fakeAccountId);
        emptyResult = await redisAccountRepository.getAll();
    });

    afterAll(async () => {
        await redisClient.disconnect();
    });

    describe('Positive save and findById', () => {
        describe('Given the repo is requested to save a new non-existent account', () => {
            describe('When returns a successful response', () => {
                test('Should have added the new record to the db (findById)', async () => {
                    expect(addedAccount?.id.value).toBe(fakeAccountId.value);
                });
            });
        });
    });

    describe('Positive getAll', () => {
        describe('Given the repo is requested to get all the stored accounts', () => {
            describe("When there's a stored account in the DB", () => {
                test('Should return an array with the stored accounts', async () => {
                    expect(foundedAccounts).toHaveLength(1);
                    expect(foundedAccounts[0].id.value).toBe(fakeAccountId.value);
                });
            });
        });
    });

    describe('delete', () => {
        describe('Given the repo is requested to delete an existent account by id', () => {
            test('Should delete the stored account', async () => {
                expect(deletedFlightPILMock).toEqual(null);
            });
        });
        describe('Given the repo is requested to delete an non-existent account by id', () => {
            test('Should do nothing and not throw', async () => {
                await redisAccountRepository.delete(fakeAccountId);
            });
        });
    });

    describe('Negative (missing) findById', () => {
        describe('Given the repo is requested to get a missing account by id', () => {
            test('Should return null', async () => {
                expect(deletedFlightPILMock).toEqual(null);
            });
        });
    });

    describe('Negative (missing) getAll', () => {
        describe('Given the repo is requested to get all the stored accounts', () => {
            describe("When there's no stored accounts", () => {
                test('Should return an empty array', async () => {
                    expect(emptyResult).toHaveLength(0);
                });
            });
        });
    });

    // The rest of negative test cases are covered in src/test/bank_account/unit/infrastructure/adapters/account_repository/redis/RedisAccountRepository.unit-test.ts
});
