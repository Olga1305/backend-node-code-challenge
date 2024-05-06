import { ServiceOptions } from 'typedi/types/interfaces/service-options.interface';
import containerPaths from '../../../../../application/ports/dependency_injection/container-paths';
import CreateAccount from '../../../../../../bank_account/application/account_operations/deposit/CreateAccount';
import DepositAmount from '../../../../../../bank_account/application/account_operations/deposit/DepositAmount';
import { RedisAccountRepository } from '../../../../../../bank_account/infrastructure/adapters/account_repository/redis/RedisAccountRepository';
import GetAllAccounts from '../../../../../../bank_account/application/account_operations/deposit/GetAllAccounts';

const dependencies: Array<ServiceOptions> = [
    { id: containerPaths.bankAccount.applicationService.createAccount, type: CreateAccount },
    { id: containerPaths.bankAccount.applicationService.getAllAccounts, type: GetAllAccounts },
    { id: containerPaths.bankAccount.applicationService.depositAmount, type: DepositAmount },
    { id: containerPaths.bankAccount.infrastructure.adapter.accountRepository, type: RedisAccountRepository },
];

export default dependencies;
