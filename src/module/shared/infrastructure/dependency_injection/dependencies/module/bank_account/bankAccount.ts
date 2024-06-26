import { ServiceOptions } from 'typedi/types/interfaces/service-options.interface';
import containerPaths from '../../../../../application/ports/dependency_injection/container-paths';
import { RedisAccountRepository } from '../../../../../../bank_account/infrastructure/adapters/account_repository/redis/RedisAccountRepository';
import { RedisTransactionRepository } from '../../../../../../bank_account/infrastructure/adapters/account_repository/redis/RedisTransactionRepository';
import CreateAccount from '../../../../../../bank_account/application/account_operations/create/CreateAccount';
import DepositAmountToAccount from '../../../../../../bank_account/application/account_operations/deposit/DepositAmountToAccount';
import GetAllAccounts from '../../../../../../bank_account/application/account_operations/getAll/GetAllAccounts';
import WithdrawAmountFromAccount from '../../../../../../bank_account/application/account_operations/withdraw/WithdrawAmountFromAccount';
import TransferAmount from '../../../../../../bank_account/application/account_operations/transfer/TransferAmount';

const dependencies: Array<ServiceOptions> = [
    { id: containerPaths.bankAccount.applicationService.createAccount, type: CreateAccount },
    { id: containerPaths.bankAccount.applicationService.getAllAccounts, type: GetAllAccounts },
    { id: containerPaths.bankAccount.applicationService.depositAmount, type: DepositAmountToAccount },
    { id: containerPaths.bankAccount.applicationService.withdrawAmount, type: WithdrawAmountFromAccount },
    { id: containerPaths.bankAccount.applicationService.transferAmount, type: TransferAmount },
    { id: containerPaths.bankAccount.infrastructure.adapter.accountRepository, type: RedisAccountRepository },
    { id: containerPaths.bankAccount.infrastructure.adapter.transactionRepository, type: RedisTransactionRepository },
];

export default dependencies;
