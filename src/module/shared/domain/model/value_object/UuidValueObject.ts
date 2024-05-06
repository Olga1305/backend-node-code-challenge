import { v4 as uuid } from 'uuid';
import validate from 'uuid-validate';
import { InvalidUuidValueError } from '../errors/InvalidUuidValueError';
import { StringValueObject } from './StringValueObject';

export class UuidValueObject extends StringValueObject {
    constructor(value?: string) {
        if (value) {
            super(value);
        } else {
            super(uuid());
        }
    }

    protected override checkValueIsValid(id: string): void {
        if (!validate(id)) {
            const context = { value: id };
            throw new InvalidUuidValueError('The provided value is not a valid UUID', { context });
        }
    }
}
