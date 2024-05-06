import { DomainValue } from '../../type/DomainValues';
import { ValueObject } from '../value_object/ValueObject';
import { Entity } from './Entity';

export abstract class AggregateRoot<T extends ValueObject<DomainValue>> extends Entity<T> {}
