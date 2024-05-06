import { DepositAmountInvalidError } from '../errors/DepositAmountInvalidError';
import { Amount } from './Amount';

export class DepositAmount extends Amount {
    protected override checkValueIsValid(value: number): void {
        if (value <= 0 || value > 5000) {
            const context = { value };
            throw new DepositAmountInvalidError('Provided value is not a valid DepositAmount value. Valid value must be in the range: [0, 5000]', { context });
        }
    }
}
