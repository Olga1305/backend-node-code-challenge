import { DomainValue } from '../../type/DomainValues';
import { UndefinedDomainValueError } from '../errors/UndefinedDomainValueError';
import { ValueObject } from '../value_object/ValueObject';

export abstract class Entity<T extends ValueObject<DomainValue>> {
    readonly id: T;

    constructor(id: T) {
        this.id = id;
        this.checkIdIsDefined(id);
    }

    private checkIdIsDefined(value: T): void {
        if (value === null || value === undefined) {
            throw new UndefinedDomainValueError('Id must be defined');
        }
    }

    equals(other: Entity<T>): boolean {
        return other.constructor.name === this.constructor.name && other.id.toString() === this.id.toString();
    }

    abstract toPrimitives(): unknown;

    toString() {
        return JSON.stringify(this.toPrimitives(), null, 2);
    }
}
