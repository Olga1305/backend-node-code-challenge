import { AggregateRoot } from '../../../../shared/domain/model/entity/AggregateRoot';
import { AccountId } from '../value_objects/AccountId';
import { Balance } from '../value_objects/Balance';
import { Currency } from '../value_objects/Currency';
import { Amount } from '../value_objects/Amount';

type AccountPrimitives = {
    id: string;
    balance: number;
    currency: string;
};

export class Account extends AggregateRoot<AccountId> {
    balance: Balance;
    currency: Currency;

    constructor(id?: AccountId, balance?: Balance, currency?: Currency) {
        super(id ?? new AccountId());
        this.currency = currency ?? new Currency('USD');
        this.balance = balance ?? new Balance(0);
    }

    incrementBalance(amount: Amount) {
        this.balance = new Balance(this.balance.value + amount.value);
    }

    override toPrimitives(): AccountPrimitives {
        const result: AccountPrimitives = {
            id: this.id.value,
            balance: this.balance.value,
            currency: this.currency.value,
        };
        return result;
    }
}