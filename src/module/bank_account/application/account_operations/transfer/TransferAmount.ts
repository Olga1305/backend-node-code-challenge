import Container from '../../../../shared/application/ports/dependency_injection/Container';
import containerPaths from '../../../../shared/application/ports/dependency_injection/container-paths';
import { Repository } from '../../../../shared/domain/ports/Repository';
import { Account } from '../../../domain/model/entities/Account';
import { Transaction } from '../../../domain/model/entities/Transacion';
import { AccountId } from '../../../domain/model/value_objects/AccountId';
import { Amount } from '../../../domain/model/value_objects/Amount';
import { TransactionId } from '../../../domain/model/value_objects/TransactionId';
import { TransactionType, TransactionsEnum } from '../../../domain/model/value_objects/TransactionType';
import { WithdrawAmount } from '../../../domain/model/value_objects/WithdrawAmount';
import { BankAccountApplicationTransferAmountError } from '../../errors/BankAccountApplicationTransferAmountError';

export default class TransferAmount {
    private accountRepository: Repository<Account, AccountId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.accountRepository);
    private transactionRepository: Repository<Transaction, TransactionId> = Container.get(containerPaths.bankAccount.infrastructure.adapter.transactionRepository);

    async run(fromAccountId: AccountId, toAccountId: AccountId, amount: Amount): Promise<Array<Account>> {
        const context = { fromAccountId: `${fromAccountId.value}`, toAccountId: `${toAccountId.value}`, amount: `${amount.value}` };
        try {
            const fromAccount = await this.accountRepository.findById(fromAccountId);
            const toAccount = await this.accountRepository.findById(toAccountId);

            if (!fromAccount || !toAccount) {
                throw new BankAccountApplicationTransferAmountError('Could not TransferAmount', { context });
            }

            const checkIfTheTransferIsPossible = this.checkIfUserCanTransfer(fromAccount, amount);
            if (!checkIfTheTransferIsPossible) throw new BankAccountApplicationTransferAmountError('Could not TransferAmount, your maximum oevrdraft is 0', { context });

            fromAccount.decreaseBalance(amount);
            await this.accountRepository.save(fromAccount);

            toAccount.incrementBalance(amount);
            await this.accountRepository.save(toAccount);

            const transaction = new Transaction(new TransactionId(), new TransactionType(TransactionsEnum.Transfer), amount, fromAccountId, toAccountId);
            await this.transactionRepository.save(transaction);

            return [fromAccount, toAccount];
        } catch (error) {
            console.error('An error happened trying to TransferAmount', error);
            if (error instanceof BankAccountApplicationTransferAmountError) throw error;
            else throw new BankAccountApplicationTransferAmountError('Could not TransferAmount', { cause: error, context });
        }
    }

    checkIfUserCanTransfer(account: Account, transferAmount: WithdrawAmount): boolean {
        if (account.balance.value - transferAmount.value < 0) return false;
        else return true;
    }
}
