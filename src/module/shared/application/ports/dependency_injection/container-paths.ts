const containerPaths = {
    entryPoint: {
        http: {
            server: 'EntryPoint.Http.Server',
            controllers: 'EntryPoint.Http.Controllers',
            middleware: {
                customError: 'EntryPoint.Http.Middleware.CustomError',
                requestLogger: 'EntryPoint.Http.Middleware.RequestLogger',
            },
        },
    },
    bankAccount: {
        applicationService: {
            createAccount: 'BankAccount.ApplicationService.CreateAccount',
            getAllAccounts: 'BankAccount.ApplicationService.GetAllAccounts',
            depositAmount: 'BankAccount.ApplicationService.DepositAmount',
            withdrawAmount: 'BankAccount.ApplicationService.WithdrawAmount',
        },
        infrastructure: {
            adapter: {
                accountRepository: 'BankAccount.Infrastructure.Adapter.AccountRepository',
                transactionRepository: 'BankAccount.Infrastructure.Adapter.TransactionRepository',
            },
        },
    },
    shared: {
        infrastructure: {
            adapter: {},
        },
    },
} as const;

export default containerPaths;
