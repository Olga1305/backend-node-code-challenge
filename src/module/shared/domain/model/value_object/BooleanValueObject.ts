import { ValueObject } from './ValueObject';

export abstract class BooleanValueObject extends ValueObject<boolean> {
    protected isValueTypeCorrect(value: unknown): boolean {
        return typeof value === 'boolean';
    }
}
