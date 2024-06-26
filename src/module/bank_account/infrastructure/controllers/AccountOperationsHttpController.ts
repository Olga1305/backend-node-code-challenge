import { JsonController, Post, HttpCode, Param, Get, OnUndefined } from 'routing-controllers';
import Container from '../../../shared/application/ports/dependency_injection/Container';
import containerPaths from '../../../shared/application/ports/dependency_injection/container-paths';
import DepositAmountToAccount from '../../application/account_operations/deposit/DepositAmountToAccount';
import { AccountId } from '../../domain/model/value_objects/AccountId';
import { DepositAmount } from '../../domain/model/value_objects/DepositAmount';
import { Account } from '../../domain/model/entities/Account';
import { Balance } from '../../domain/model/value_objects/Balance';
import CreateAccount from '../../application/account_operations/create/CreateAccount';
import GetAllAccounts from '../../application/account_operations/getAll/GetAllAccounts';
import WithdrawAmountFromAccount from '../../application/account_operations/withdraw/WithdrawAmountFromAccount';
import { WithdrawAmount } from '../../domain/model/value_objects/WithdrawAmount';
import TransferAmount from '../../application/account_operations/transfer/TransferAmount';
import { Amount } from '../../domain/model/value_objects/Amount';
import { AccountOperationsHttpControllerError } from './errors/AccountOperationsHttpControllerError';

@JsonController('/bank/account/')
export class AccountOperationsHttpController {
    private readonly createAccountService: CreateAccount = Container.get(containerPaths.bankAccount.applicationService.createAccount);
    private readonly getAllAccountsService: GetAllAccounts = Container.get(containerPaths.bankAccount.applicationService.getAllAccounts);
    private readonly depositAmountService: DepositAmountToAccount = Container.get(containerPaths.bankAccount.applicationService.depositAmount);
    private readonly withdrawAmountService: WithdrawAmountFromAccount = Container.get(containerPaths.bankAccount.applicationService.withdrawAmount);
    private readonly transferAmountService: TransferAmount = Container.get(containerPaths.bankAccount.applicationService.transferAmount);

    @HttpCode(201)
    @Post('create/:withBalance')
    async createAccount(@Param('withBalance') balanceValue: number): Promise<Account> {
        const account = new Account(new AccountId(), new Balance(balanceValue));
        const createdAccount = await this.createAccountService.run(account);
        if (!createdAccount) throw new AccountOperationsHttpControllerError('Could not create a new account');
        console.log(`Success: Created a new account with ID <${createdAccount.id.value}> and balance <${createdAccount.currency.value}${createdAccount.balance.value}>`);
        return createdAccount;
    }

    @Get('all')
    async getAllAccounts(): Promise<Array<Account>> {
        const accounts = await this.getAllAccountsService.run();
        if (!accounts) throw new AccountOperationsHttpControllerError('Could not get all accounts');
        console.log('Success: Getted all accounts');
        return accounts;
    }

    @HttpCode(201)
    @Post('deposit/:accountId/:depositAmount')
    async depositAmount(@Param('accountId') accountIdValue: string, @Param('depositAmount') amountValue: number): Promise<Account> {
        const accountId = new AccountId(accountIdValue);
        const amount = new DepositAmount(amountValue);

        const updatedAccount = await this.depositAmountService.run(accountId, amount);

        if (!updatedAccount) throw new AccountOperationsHttpControllerError(`Could not deposit amount <${amountValue}> to the account with ID <${accountIdValue}>`);

        console.log(`Success: Deposited amount <${updatedAccount.currency.value}${amountValue}> to the account with ID <${accountIdValue}>`);

        return updatedAccount;
    }

    @HttpCode(201)
    @Post('withdraw/:accountId/:withdrawalAmount')
    async withdrawAmount(@Param('accountId') accountIdValue: string, @Param('withdrawalAmount') amountValue: number): Promise<Account> {
        const accountId = new AccountId(accountIdValue);
        const amount = new WithdrawAmount(amountValue);

        const updatedAccount = await this.withdrawAmountService.run(accountId, amount);

        if (!updatedAccount) throw new AccountOperationsHttpControllerError(`Could not withdraw amount <${amountValue}> from the account with ID <${accountIdValue}>`);

        console.log(`Success: Withdrawed amount <${updatedAccount.currency.value}${amountValue}> from the account with ID <${accountIdValue}>`);

        return updatedAccount;
    }

    @HttpCode(201)
    @Post('transfer/:fromAccountId/:toAccountId/:transferAmount')
    async transfer(
        @Param('fromAccountId') fromAccountIdValue: string,
        @Param('toAccountId') toAccountIdValue: string,
        @Param('transferAmount') amountValue: number
    ): Promise<Array<Account>> {
        const fromAccountId = new AccountId(fromAccountIdValue);
        const toAccountId = new AccountId(toAccountIdValue);
        const amount = new Amount(amountValue);

        const updatedAccounts = await this.transferAmountService.run(fromAccountId, toAccountId, amount);

        if (!updatedAccounts) throw new AccountOperationsHttpControllerError(`Could not transafer amount <${amountValue}> from the accoun with ID <${fromAccountIdValue}>`);

        console.log(
            `Success: Transfered amount <${updatedAccounts[0].currency.value}${amountValue}> from the account with ID <${fromAccountIdValue}> to the account with ID <${toAccountIdValue}> `
        );

        return updatedAccounts;
    }
}
