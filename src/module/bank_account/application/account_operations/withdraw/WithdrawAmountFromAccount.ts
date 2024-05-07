import Container from '../../../../shared/application/ports/dependency_injection/Container';
import containerPaths from '../../../../shared/application/ports/dependency_injection/container-paths';
import { Repository } from '../../../../shared/domain/ports/Repository';
import { NotFoundAccountDomainError } from '../../../domain/error/NotFoundAccountDomainError';
import { Account } from '../../../domain/model/entities/Account';
import { Transaction } from '../../../domain/model/entities/Transacion';
import { AccountId } from '../../../domain/model/value_objects/AccountId';
import { TransactionId } from '../../../domain/model/value_objects/TransactionId';
import { TransactionType, TransactionsEnum } from '../../../domain/model/value_objects/TransactionType';
import { WithdrawAmount } from '../../../domain/model/value_objects/WithdrawAmount';
import { BankAccountApplicationWithdrawAmountError } from '../../errors/BankAccountApplicationWithdrawAmountError';

// Could be at .env file if needed
const MAX_BALANCE_OVERDRAFT = -200;

export default class WithdrawAmountFromAccount {
    private accountRepository: Repository<Account, AccountId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.accountRepository);
    private transactionRepository: Repository<Transaction, TransactionId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.transactionRepository);

    async run(accountId: AccountId, amount: WithdrawAmount): Promise<Account> {
        const context = { accountId: `${accountId.value}`, amount: `${amount.value}` };
        try {
            const account = await this.accountRepository.findById(accountId);
            if (!account) {
                throw new NotFoundAccountDomainError('Could not WithdrawAmountFromAccount', { context });
            }

            const checkIfTheWithdrawalIsPossible = this.checkIfUserCanWithdraw(account, amount);
            if (!checkIfTheWithdrawalIsPossible)
                throw new BankAccountApplicationWithdrawAmountError(`Could not WithdrawAmountFromAccount, your maximum oevrdraft is ${MAX_BALANCE_OVERDRAFT}`, { context });

            account.decreaseBalance(amount);
            await this.accountRepository.save(account);

            const transaction = new Transaction(new TransactionId(), new TransactionType(TransactionsEnum.Withdrawal), amount, accountId);
            await this.transactionRepository.save(transaction);

            return account;
        } catch (error) {
            console.error('An error happened trying to WithdrawAmountFromAccount', error);
            if (error instanceof BankAccountApplicationWithdrawAmountError || error instanceof NotFoundAccountDomainError) throw error;
            else throw new BankAccountApplicationWithdrawAmountError('Could not WithdrawAmountFromAccount', { cause: error, context });
        }
    }

    checkIfUserCanWithdraw(account: Account, newWithdrawalAmount: WithdrawAmount): boolean {
        if (account.balance.value - newWithdrawalAmount.value < MAX_BALANCE_OVERDRAFT) return false;
        else return true;
    }
}
