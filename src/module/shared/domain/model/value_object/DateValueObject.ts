import { ValueObject } from './ValueObject';

export abstract class DateValueObject extends ValueObject<Date> {
    override toString(): string {
        return this.value.toISOString();
    }

    protected isValueTypeCorrect(value: unknown): boolean {
        return value instanceof Date;
    }
}
