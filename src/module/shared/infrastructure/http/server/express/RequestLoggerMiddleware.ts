import { Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class RequestLoggerMiddleware implements ExpressMiddlewareInterface {
    use(request: Request, _: Response, next: (err?: unknown) => unknown) {
        const { method, url, path } = request;
        const timestamp = new Date().toISOString();

        if (path === '/health') return next();
        console.log(`RequestLoggerMiddleware: [${timestamp}] ${method} ${url}`);

        next();
    }
}
