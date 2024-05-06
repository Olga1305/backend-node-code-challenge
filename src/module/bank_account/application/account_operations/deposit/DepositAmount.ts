import Container from '../../../../shared/application/ports/dependency_injection/Container';
import containerPaths from '../../../../shared/application/ports/dependency_injection/container-paths';
import { Repository } from '../../../../shared/domain/ports/Repository';
import { Account } from '../../../domain/model/entities/Account';
import { AccountId } from '../../../domain/model/value_objects/AccountId';
import { Amount } from '../../../domain/model/value_objects/Amount';
import { BankAccountApplicationDepositAmountError } from '../../errors/BankAccountApplicationDepositAmountError';

export default class DepositAmount {
    private accountRepository: Repository<Account, AccountId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.accountRepository);
    // private transactionRepository: Repository<TailMapping, TailMappingId> = Container.get(containerPaths.entitlements.adapter.tailMappingRepository);

    async run(accountId: AccountId, amount: Amount): Promise<Account> {
        const context = { accountId: `${accountId.value}`, amount: `${amount.value}` };
        try {
            // const transaction = new Transaction();

            const account = await this.accountRepository.findById(accountId);
            if (!account) {
                throw new BankAccountApplicationDepositAmountError('Could not DepositAmount', { context });
            }
            account.incrementBalance(amount);
            await this.accountRepository.save(account);
            return account;
        } catch (error) {
            console.error('An error happened trying to DepositAmount', error);
            throw new BankAccountApplicationDepositAmountError('Could not DepositAmount', { cause: error, context });
        }
    }
}
