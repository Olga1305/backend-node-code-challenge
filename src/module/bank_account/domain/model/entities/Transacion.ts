import { Entity } from '../../../../shared/domain/model/entity/Entity';
import { TransactionId } from '../value_objects/TransactionId';
import { Currency } from '../value_objects/Currency';
import { Amount } from '../value_objects/Amount';
import { TransactionType } from '../value_objects/TransactionType';
import { AccountId } from '../value_objects/AccountId';
import { Nullable } from '../../../../shared/domain/type/Nullable';
import { TransactionCreatedDate } from '../value_objects/TransactionCreatedDate';
import { EnumType } from '../../../../shared/domain/type/EnumType';
import { DepositAmount } from '../value_objects/DepositAmount';
import { WithdrawAmount } from '../value_objects/WithdrawAmount';

export type TransactionPrimitives = {
    id: string;
    type: EnumType;
    amount: number;
    mainAccountId: string;
    createdAt: Date;
    currency: string;
    recipientAccountId?: string;
};

export class Transaction extends Entity<TransactionId> {
    type: TransactionType;
    amount: Amount | DepositAmount | WithdrawAmount;
    mainAccountId: AccountId;
    createdAt: TransactionCreatedDate;
    currency: Currency;
    recipientAccountId: Nullable<AccountId>;

    constructor(id: TransactionId, type: TransactionType, amount: Amount | DepositAmount, mainAccountId: AccountId, currency?: Currency, recipientAccountId?: Nullable<AccountId>) {
        super(id);
        this.type = type;
        this.amount = amount;
        this.mainAccountId = mainAccountId;
        this.currency = currency ?? new Currency('USD');
        this.createdAt = new TransactionCreatedDate();
        if (recipientAccountId) this.recipientAccountId = recipientAccountId;
    }

    override toPrimitives(): TransactionPrimitives {
        return {
            id: this.id.value,
            type: this.type.value,
            amount: this.amount.value,
            mainAccountId: this.mainAccountId.value,
            createdAt: this.createdAt.value,
            currency: this.currency.value,
            ...(this.recipientAccountId ? { recipientAccountId: this.recipientAccountId.value } : {}),
        };
    }
}
