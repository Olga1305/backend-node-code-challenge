import { Account } from '../../../../domain/model/entities/Account';
import { AccountId } from '../../../../domain/model/value_objects/AccountId';
import { Balance } from '../../../../domain/model/value_objects/Balance';
import { Currency } from '../../../../domain/model/value_objects/Currency';
import RedisAccountRepositoryError from '../../../../domain/ports/errors/RedisAccountRepositoryError';
import { BaseRedisRepository, RedisStoredHash } from './BaseRedisRepository';

const setName = 'account';

export class RedisAccountRepository extends BaseRedisRepository<Account, AccountId> {
    constructor() {
        super(setName);
    }

    getIdValue(account: Account): string {
        return account.id.value;
    }

    createIdFromValue(accountIdValue: string): AccountId {
        return new AccountId(accountIdValue);
    }

    deserialize(storedAccount: RedisStoredHash): Account {
        return new Account(new AccountId(storedAccount.id), new Balance(parseInt(storedAccount.balance)), new Currency(storedAccount.currency));
    }

    serialize(account: Account): RedisStoredHash {
        return {
            id: account.id.value,
            balance: account.balance.toString(),
            currency: account.currency.value,
        };
    }

    getError(errorMessage: string, errorOptions: Record<string, unknown>): RedisAccountRepositoryError {
        return new RedisAccountRepositoryError(errorMessage, errorOptions);
    }
}
