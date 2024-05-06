import { Repository } from '../../../shared/domain/ports/Repository';
import { Account } from '../model/entities/Account';
import { AccountId } from '../model/value_objects/AccountId';

export type AccountRepository = Repository<Account, AccountId>;
