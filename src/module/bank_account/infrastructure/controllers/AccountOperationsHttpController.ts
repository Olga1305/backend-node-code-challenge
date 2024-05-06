import { JsonController, Post, HttpCode, Param, Get } from 'routing-controllers';
import Container from '../../../shared/application/ports/dependency_injection/Container';
import containerPaths from '../../../shared/application/ports/dependency_injection/container-paths';
import DepositAmount from '../../application/account_operations/deposit/DepositAmount';
import { AccountId } from '../../domain/model/value_objects/AccountId';
import { Amount } from '../../domain/model/value_objects/Amount';
import { Account } from '../../domain/model/entities/Account';
import { Balance } from '../../domain/model/value_objects/Balance';
import CreateAccount from '../../application/account_operations/deposit/CreateAccount';
import GetAllAccounts from '../../application/account_operations/deposit/GetAllAccounts';
import { AccountOperationsHttpControllerError } from './errors/AccountOperationsHttpControllerError';

@JsonController('/bank/account/')
export class AccountOperationsHttpController {
    private readonly createAccountService: CreateAccount = Container.get(containerPaths.bankAccount.applicationService.createAccount);
    private readonly getAllAccountsService: GetAllAccounts = Container.get(containerPaths.bankAccount.applicationService.getAllAccounts);
    private readonly depositAmountService: DepositAmount = Container.get(containerPaths.bankAccount.applicationService.depositAmount);

    @HttpCode(201)
    @Post('create/:balance')
    async createAccount(@Param('balance') balanceValue: number): Promise<Account> {
        const account = new Account(new AccountId(), new Balance(balanceValue));
        console.log(account);
        try {
            await this.createAccountService.run(account);
        } catch (error) {
            throw new AccountOperationsHttpControllerError('Could not create a new account');
        }

        console.log(`Success: Created a new account with ID <${account.id.value}> and balance <${account.currency.value}${account.balance.value}>`);

        return account;
    }

    @Get('all')
    async getAllAccounts(): Promise<Array<Account>> {
        const accounts = await this.getAllAccountsService.run();

        if (!accounts) throw new AccountOperationsHttpControllerError('Could not get all accounts');

        console.log('Success: Getted all accounts');

        return accounts;
    }

    @HttpCode(201)
    @Post('deposit/:accountId/:amount')
    async depositAmount(@Param('accountId') accountIdValue: string, @Param('amount') amountValue: number): Promise<Account> {
        const accountId = new AccountId(accountIdValue);
        const amount = new Amount(amountValue);

        const updatedAccount = await this.depositAmountService.run(accountId, amount);

        if (!updatedAccount) throw new AccountOperationsHttpControllerError(`Could not deposit amount <${amountValue}> to the accoun with ID <${accountIdValue}>`);

        console.log(`Success: Deposited amount <${updatedAccount.currency.value}${amountValue}> to the accoun with ID <${accountIdValue}>`);

        return updatedAccount;
    }
}
