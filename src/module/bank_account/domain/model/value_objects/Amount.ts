import { NumberValueObject } from '../../../../shared/domain/model/value_object/NumberValueObject';
import { AmountInvalidError } from '../errors/AmountInvalidError';

export class Amount extends NumberValueObject {
    protected override checkValueIsValid(value: number): void {
        if (value <= 0) {
            const context = { value };
            throw new AmountInvalidError('Provided value is not a valid Amount value. Valid value must be igreater than 0', { context });
        }
    }
}
