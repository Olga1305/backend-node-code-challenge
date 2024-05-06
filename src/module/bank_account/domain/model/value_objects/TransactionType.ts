import { EnumValueObject } from '../../../../shared/domain/model/value_object/EnumValueObject';
import { EnumType } from '../../../../shared/domain/type/EnumType';
import { TransactionTypeInvalidError } from '../errors/TransactionTypeInvalidError';

export enum TransactionsEnum {
    Deposit = 'Deposit',
    Withdrawal = 'Withdrawal',
    Transfer = 'Transfer',
}

export class TransactionType extends EnumValueObject {
    override checkValueIsValid(value: EnumType): void {
        const allowedValues = Object.values(TransactionsEnum) as Array<EnumType>;
        if (!allowedValues.includes(value)) {
            const context = { value };
            throw new TransactionTypeInvalidError('Provided value is not a valid Opco', { context });
        }
    }
}
