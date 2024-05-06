import { Transaction } from '../../../../domain/model/entities/Transacion';
import { AccountId } from '../../../../domain/model/value_objects/AccountId';
import { Amount } from '../../../../domain/model/value_objects/Amount';
import { Currency } from '../../../../domain/model/value_objects/Currency';
import { TransactionId } from '../../../../domain/model/value_objects/TransactionId';
import { TransactionType } from '../../../../domain/model/value_objects/TransactionType';
import RedisTransactionRepositoryError from '../../../../domain/ports/errors/RedisTransactionRepositoryError';
import { BaseRedisRepository, RedisStoredHash } from './BaseRedisRepository';

const setName = 'transaction';

export class RedisTransactionRepository extends BaseRedisRepository<Transaction, TransactionId> {
    constructor() {
        super(setName);
    }

    getIdValue(transaction: Transaction): string {
        return transaction.id.value;
    }

    createIdFromValue(transactionIdValue: string): TransactionId {
        return new TransactionId(transactionIdValue);
    }

    deserialize(storedTransaction: RedisStoredHash): Transaction {
        return new Transaction(
            new TransactionId(storedTransaction.id),
            new TransactionType(storedTransaction.type),
            new Amount(parseInt(storedTransaction.amount)),
            new AccountId(storedTransaction.mainAccountId),
            storedTransaction.recipientAccountId ? new AccountId(storedTransaction.recipientAccountId) : null,
            new Currency(storedTransaction.currency)
        );
    }

    serialize(transaction: Transaction): RedisStoredHash {
        return {
            id: transaction.id.value,
            type: transaction.type.toString(),
            amount: transaction.amount.toString(),
            mainAccountId: transaction.mainAccountId.value,
            createdAt: transaction.createdAt.toString(),
            recipientAccountId: transaction.recipientAccountId?.toString() ?? '',
            currency: transaction.currency.value,
        };
    }

    getError(errorMessage: string, errorOptions: Record<string, unknown>): RedisTransactionRepositoryError {
        return new RedisTransactionRepositoryError(errorMessage, errorOptions);
    }
}
