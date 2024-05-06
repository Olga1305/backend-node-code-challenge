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
        },
        infrastructure: {
            adapter: {
                accountRepository: 'BankAccount.Infrastructure.Adapter.AccountRepository',
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
