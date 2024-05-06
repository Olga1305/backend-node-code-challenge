import { ServiceOptions } from 'typedi/types/interfaces/service-options.interface';
import containerPaths from '../../../../../application/ports/dependency_injection/container-paths';
import CreateAccount from '../../../../../../bank_account/application/account_operations/create/CreateAccount';
import DepositAmountToAccount from '../../../../../../bank_account/application/account_operations/deposit/DepositAmountToAccount';
import { RedisAccountRepository } from '../../../../../../bank_account/infrastructure/adapters/account_repository/redis/RedisAccountRepository';
import GetAllAccounts from '../../../../../../bank_account/application/account_operations/getAll/GetAllAccounts';
import { RedisTransactionRepository } from '../../../../../../bank_account/infrastructure/adapters/account_repository/redis/RedisTransactionRepository';

const dependencies: Array<ServiceOptions> = [
    { id: containerPaths.bankAccount.applicationService.createAccount, type: CreateAccount },
    { id: containerPaths.bankAccount.applicationService.getAllAccounts, type: GetAllAccounts },
    { id: containerPaths.bankAccount.applicationService.depositAmount, type: DepositAmountToAccount },
    { id: containerPaths.bankAccount.infrastructure.adapter.accountRepository, type: RedisAccountRepository },
    { id: containerPaths.bankAccount.infrastructure.adapter.transactionRepository, type: RedisTransactionRepository },
];

export default dependencies;
