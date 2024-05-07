import http from 'http';
import request from 'supertest';

export async function requestGetAllAccounts(server: http.Server) {
    return request(server).get('/bank/account/all');
}

export async function requestCreateNewAccount(balance: unknown, server: http.Server) {
    return request(server).post(`/bank/account/create/${balance}`);
}

export async function requestDepositAmount(accountId: unknown, depositAmount: unknown, server: http.Server) {
    return request(server).post(`/bank/account/deposit/${accountId}/${depositAmount}`);
}

export async function requestWithdrawAmount(accountId: unknown, withdrawalAmount: unknown, server: http.Server) {
    return request(server).post(`/bank/account/withdraw/${accountId}/${withdrawalAmount}`);
}

export async function requestTransferAmount(fromAccountId: unknown, toAccountId: unknown, transferAmount: unknown, server: http.Server) {
    return request(server).post(`/bank/account/transfer/${fromAccountId}/${toAccountId}/${transferAmount}`);
}
