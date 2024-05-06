import { ValueObject } from '../model/value_object/ValueObject';
import { Primitive } from './Primitive';

export type SimpleDomainValue = Primitive | Date;

export interface CompoundDomainValue {
    [key: string]: SimpleDomainValue | CompoundDomainValue;
}

export type CompoundValueObjectValue = Record<string, ValueObject<SimpleDomainValue | CompoundDomainValue>>;

export type DomainValue = SimpleDomainValue | CompoundDomainValue | CompoundValueObjectValue;
