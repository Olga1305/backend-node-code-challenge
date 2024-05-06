import { UndefinedDomainValueError } from '../errors/UndefinedDomainValueError';
import { DomainValue } from '../../type/DomainValues';
import { DomainValueTypeError } from '../errors/DomainValueTypeError';
export abstract class ValueObject<T extends DomainValue> {
    readonly value: T;

    constructor(value: T) {
        this.value = value;
        this.checkValueIsDefined(value);
        this.checkValueType(value);
        this.checkValueIsValid(value);
    }

    private checkValueIsDefined(value: T): void {
        if (value === null || value === undefined) {
            throw new UndefinedDomainValueError('Value must be defined');
        }
    }

    private checkValueType(value: T): void {
        if (!this.isValueTypeCorrect(value)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            throw new DomainValueTypeError('Provided value does not match the expected type', { context: { value: value as any } });
        }
    }

    protected abstract isValueTypeCorrect(_value: T): boolean;

    protected checkValueIsValid(_value: T): void {
        // to be overriden in subclasses, when needed
    }

    equals(other: ValueObject<T>): boolean {
        return other.constructor.name === this.constructor.name && other.value.toString() === this.value.toString();
    }

    toString(): string {
        return this.value.toString();
    }
}
