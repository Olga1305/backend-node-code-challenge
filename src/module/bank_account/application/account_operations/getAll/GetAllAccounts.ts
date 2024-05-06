import Container from '../../../../shared/application/ports/dependency_injection/Container';
import containerPaths from '../../../../shared/application/ports/dependency_injection/container-paths';
import { Repository } from '../../../../shared/domain/ports/Repository';
import { Account } from '../../../domain/model/entities/Account';
import { AccountId } from '../../../domain/model/value_objects/AccountId';
import { BankAccountApplicationCreateAccountError } from '../../errors/BankAccountApplicationCreateAccountError';

export default class GetAllAccounts {
    private accountRepository: Repository<Account, AccountId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.accountRepository);

    async run(): Promise<Array<Account>> {
        try {
            return await this.accountRepository.getAll();
        } catch (error) {
            console.error('An error happened trying to GetAllAccounts', error);
            throw new BankAccountApplicationCreateAccountError('Could not GetAllAccounts', { cause: error });
        }
    }
}
