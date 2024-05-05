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
        applicationService: {},
        infrastructure: {
            adapter: {},
        },
    },
    shared: {
        infrastructure: {
            adapter: {},
        },
    },
} as const;

export default containerPaths;
