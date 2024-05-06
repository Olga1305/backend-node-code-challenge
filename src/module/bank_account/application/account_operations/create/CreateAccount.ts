import Container from '../../../../shared/application/ports/dependency_injection/Container';
import containerPaths from '../../../../shared/application/ports/dependency_injection/container-paths';
import { Repository } from '../../../../shared/domain/ports/Repository';
import { Account } from '../../../domain/model/entities/Account';
import { AccountId } from '../../../domain/model/value_objects/AccountId';
import { BankAccountApplicationCreateAccountError } from '../../errors/BankAccountApplicationCreateAccountError';

export default class CreateAccount {
    private accountRepository: Repository<Account, AccountId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.accountRepository);

    async run(account: Account): Promise<Account> {
        try {
            await this.accountRepository.save(account);
            return account;
        } catch (error) {
            console.error('An error happened trying to CreateAccount', error);
            const context = { account };
            throw new BankAccountApplicationCreateAccountError('Could not CreateAccount', { cause: error, context });
        }
    }
}
