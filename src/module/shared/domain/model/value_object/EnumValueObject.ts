import { EnumType } from '../../type/EnumType';
import { ValueObject } from './ValueObject';

export abstract class EnumValueObject extends ValueObject<EnumType> {
    abstract override checkValueIsValid(value: EnumType): void;

    protected isValueTypeCorrect(value: unknown): boolean {
        return typeof value === 'string' || typeof value === 'number';
    }
}
