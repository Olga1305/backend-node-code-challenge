import { DateValueObject } from '../../../../shared/domain/model/value_object/DateValueObject';

export class TransactionCreatedDate extends DateValueObject {
    constructor(value?: string | number | Date) {
        super(value ? new Date(value) : new Date());
    }
}
