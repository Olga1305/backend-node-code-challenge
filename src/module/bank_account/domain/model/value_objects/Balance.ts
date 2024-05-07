import { NumberValueObject } from '../../../../shared/domain/model/value_object/NumberValueObject';
import { BalanceInvalidError } from '../errors/BalanceInvalidError';

export class Balance extends NumberValueObject {
    protected override checkValueIsValid(value: unknown): void {
        if (typeof value !== 'number') {
            const context = { value };
            throw new BalanceInvalidError('Provided value is not a valid Balance value. Valid value must be igreater than 0', { context });
        }
    }
}
