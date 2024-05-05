import { ValueObject } from './ValueObject';

export abstract class NumberValueObject extends ValueObject<number> {
    protected isValueTypeCorrect(value: unknown): boolean {
        return typeof value === 'number';
    }
    isGreaterThan(other: NumberValueObject): boolean {
        return this.value > other.value;
    }
    isGreaterOrEqualThan(other: NumberValueObject): boolean {
        return this.value >= other.value;
    }
    isLessThan(other: NumberValueObject): boolean {
        return this.value < other.value;
    }
    isLessOrEqualThan(other: NumberValueObject): boolean {
        return this.value <= other.value;
    }
    // with the composition of the previous methods it is algo possible
    // to verify inclusive/exclusive ranges [...] / (...)
}
