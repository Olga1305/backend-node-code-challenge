import Container from '../../../../shared/application/ports/dependency_injection/Container';
import containerPaths from '../../../../shared/application/ports/dependency_injection/container-paths';
import { Repository } from '../../../../shared/domain/ports/Repository';
import { Account } from '../../../domain/model/entities/Account';
import { Transaction } from '../../../domain/model/entities/Transacion';
import { AccountId } from '../../../domain/model/value_objects/AccountId';
import { DepositAmount } from '../../../domain/model/value_objects/DepositAmount';
import { TransactionId } from '../../../domain/model/value_objects/TransactionId';
import { TransactionType, TransactionsEnum } from '../../../domain/model/value_objects/TransactionType';
import { BankAccountApplicationDepositAmountError } from '../../errors/BankAccountApplicationDepositAmountError';

// Could be at .env file if needed
const MAX_DEPOSIT_AMOUNT_PER_DAY = 5000;

export default class DepositAmountToAccount {
    private accountRepository: Repository<Account, AccountId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.accountRepository);
    private transactionRepository: Repository<Transaction, TransactionId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.transactionRepository);

    async run(accountId: AccountId, amount: DepositAmount): Promise<Account> {
        const context = { accountId: `${accountId.value}`, amount: `${amount.value}` };
        try {
            const checkIfTheDepositIsPossible = await this.checkIfUserCanDeposit(accountId, amount);
            if (!checkIfTheDepositIsPossible) throw new BankAccountApplicationDepositAmountError('Could not DepositAmountToAccount, you exceeded the day limit', { context });

            const account = await this.accountRepository.findById(accountId);
            if (!account) {
                throw new BankAccountApplicationDepositAmountError('Could not DepositAmountToAccount', { context });
            }
            account.incrementBalance(amount);
            await this.accountRepository.save(account);

            const transaction = new Transaction(new TransactionId(), new TransactionType(TransactionsEnum.Deposit), amount, accountId);
            await this.transactionRepository.save(transaction);

            return account;
        } catch (error) {
            console.error('An error happened trying to DepositAmountToAccount', error);
            if (error instanceof BankAccountApplicationDepositAmountError) throw error;
            else throw new BankAccountApplicationDepositAmountError('Could not DepositAmountToAccount', { cause: error, context });
        }
    }

    getTheDay(date: Date) {
        return date.toISOString().slice(0, 10);
    }

    async checkIfUserCanDeposit(accountId: AccountId, newDepositAmount: DepositAmount): Promise<boolean> {
        const today = this.getTheDay(new Date());
        const transactions = await this.transactionRepository.getAll();
        if (!transactions.length) return true;
        const todayUserDepositTransactions = transactions.filter(
            (item) => item.mainAccountId.value === accountId.value && item.type.value === TransactionsEnum.Deposit && this.getTheDay(item.createdAt.value) === today
        );
        if (!todayUserDepositTransactions.length) return true;
        const todayDepositsAmount = todayUserDepositTransactions.reduce((acc, curr) => acc + curr.amount.value, 0);
        if (todayDepositsAmount + newDepositAmount.value <= MAX_DEPOSIT_AMOUNT_PER_DAY) return true;
        else {
            console.log(`The user already has deposited today ${todayDepositsAmount} and can deposit ${today} no more tnan ${MAX_DEPOSIT_AMOUNT_PER_DAY - todayDepositsAmount}`);
            return false;
        }
    }
}
