require('reflect-metadata');
import http from 'http';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { Server } from '../../../module/shared/infrastructure/http/server/Server';
import { RedisDbClient } from '../../../module/shared/infrastructure/db/redis/RedisDBClient';
import containerPaths from '../../../module/shared/application/ports/dependency_injection/container-paths';
import Container from '../../../module/shared/application/ports/dependency_injection/Container';
import { requestGetAllAccounts, requestCreateNewAccount, requestDepositAmount, requestWithdrawAmount, requestTransferAmount } from './helpers/request-helper';

let server: http.Server;
const redisClient = RedisDbClient.getInstance();

describe('AccountOperationsHttpController', () => {
    const validInitialBalance = 500;
    const invalidInitialBalance = 'whatever';
    const validAccountId = uuid();
    const invalidAccountId = 777;
    const validDepositAmount = 300;
    const invalidDepositAmount = 'whatever';
    const validwithdrawalAmount = 100;
    const invalidwithdrawalAmount = 'whatever';

    let firstExistingAccountId: string;
    let secondExistingAccountId: string;
    let firstExistingAccountInitialBalance: number;
    let secondExistingAccountInitialBalance: number;

    let getAllFirstResponse: request.Response;
    let getAllSecondResponse: request.Response;
    let getAllTirdResponse: request.Response;
    let createAccountFirstResponse: request.Response;

    beforeAll(async () => {
        server = Container.get<Server>(containerPaths.entryPoint.http.server).setup();
        await redisClient.executeCommand((connectedClient) => connectedClient.flushAll());

        getAllFirstResponse = await requestGetAllAccounts(server);
        createAccountFirstResponse = await requestCreateNewAccount(validInitialBalance, server);
        getAllSecondResponse = await requestGetAllAccounts(server);
        await requestCreateNewAccount(validInitialBalance, server);
        getAllTirdResponse = await requestGetAllAccounts(server);

        firstExistingAccountId = getAllTirdResponse.body[0].id.value;
        firstExistingAccountInitialBalance = getAllTirdResponse.body[0].balance.value;
        secondExistingAccountId = getAllTirdResponse.body[1].id.value;
        secondExistingAccountInitialBalance = getAllTirdResponse.body[1].balance.value;
    });

    afterAll(async () => {
        await redisClient.disconnect();
    });

    describe('GET /bank/account/all', () => {
        describe('When there is no account in the db', () => {
            test('Should return an empty array and status 200', async () => {
                expect(getAllFirstResponse.statusCode).toBe(200);
                expect(getAllFirstResponse.body).toEqual([]);
            });
        });

        describe('When there are some accounts in the db', () => {
            test('Should return an array with accounts and status 200', async () => {
                expect(getAllSecondResponse.statusCode).toBe(200);
                expect(getAllSecondResponse.body[0].balance.value).toEqual(validInitialBalance);
            });
        });
    });

    describe('POST /bank/account/create/{withBalance}', () => {
        describe('Given a valid request', () => {
            test('Should save a new account to the db and return 201 status', async () => {
                expect(createAccountFirstResponse.statusCode).toBe(201);
                expect(createAccountFirstResponse.body.balance.value).toEqual(validInitialBalance);
            });
        });

        describe('Given an invalid withBalance parameter', () => {
            test('Should return 400 Bad request', async () => {
                const response = await requestCreateNewAccount(invalidInitialBalance, server);
                expect(response.statusCode).toBe(400);
            });
        });
    });

    describe('POST /bank/account/deposit/{accountId}/{depositAmount}', () => {
        describe('Given a valid request', () => {
            describe('When the requested account is in the db and the daily deposit limit is not exceeded', () => {
                test('Should update the balance and return status 201', async () => {
                    const response = await requestDepositAmount(firstExistingAccountId, validDepositAmount, server);
                    expect(response.statusCode).toBe(201);
                    expect(response.body.balance.value).toEqual(firstExistingAccountInitialBalance + validDepositAmount);
                });
            });

            describe('When the requested account does not exist in the db', () => {
                test('Should return status 404', async () => {
                    const response = await requestDepositAmount(validAccountId, validDepositAmount, server);
                    expect(response.statusCode).toBe(404);
                });
            });
        });

        describe('Given an ivalid request', () => {
            describe('Given an invalid accountId', () => {
                test('Should return 400 Bad request', async () => {
                    const response = await requestDepositAmount(invalidAccountId, validDepositAmount, server);
                    expect(response.statusCode).toBe(400);
                });
            });

            describe('Given an invalid depositAmount', () => {
                test('Should return 400 Bad request', async () => {
                    const response = await requestDepositAmount(validAccountId, invalidDepositAmount, server);
                    expect(response.statusCode).toBe(400);
                });
            });
        });
    });

    describe('POST /bank/account/withdraw/{accountId}/{withdrawalAmount}', () => {
        describe('Given a valid request', () => {
            describe('When the requested account is in the db and the balance overdraft is not exceeded', () => {
                test('Should update the balance and return status 201', async () => {
                    const response = await requestWithdrawAmount(secondExistingAccountId, validwithdrawalAmount, server);
                    expect(response.statusCode).toBe(201);
                    expect(response.body.balance.value).toEqual(secondExistingAccountInitialBalance - validwithdrawalAmount);
                });
            });

            describe('When the requested account does not exist in the db', () => {
                test('Should return status 404', async () => {
                    const response = await requestWithdrawAmount(validAccountId, validwithdrawalAmount, server);
                    expect(response.statusCode).toBe(404);
                });
            });
        });

        describe('Given an ivalid request', () => {
            describe('Given an invalid accountId', () => {
                test('Should return 400 Bad request', async () => {
                    const response = await requestWithdrawAmount(invalidAccountId, validwithdrawalAmount, server);
                    expect(response.statusCode).toBe(400);
                });
            });

            describe('Given an invalid withdrawalAmount', () => {
                test('Should return 400 Bad request', async () => {
                    const response = await requestWithdrawAmount(validAccountId, invalidwithdrawalAmount, server);
                    expect(response.statusCode).toBe(400);
                });
            });
        });
    });
});

// There are more test cases for above endpoints and /transfer endpoint as well, but I should stop here
