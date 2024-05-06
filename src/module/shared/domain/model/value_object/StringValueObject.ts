import { ValueObject } from './ValueObject';

export abstract class StringValueObject extends ValueObject<string> {
    protected isValueTypeCorrect(value: unknown): boolean {
        return typeof value === 'string';
    }
}
