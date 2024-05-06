import { DateValueObject } from '../../../../shared/domain/model/value_object/DateValueObject';

export class CreatedDate extends DateValueObject {
    constructor() {
        super(new Date());
    }
}
