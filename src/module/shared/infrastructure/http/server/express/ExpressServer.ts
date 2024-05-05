import http from 'http';
import express, { RequestHandler } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { useExpressServer } from 'routing-controllers';
import { Server } from '../Server';
import { ServerError } from '../ServerError';
import Container from '../../../../application/ports/dependency_injection/Container';
import containerPaths from '../../../../application/ports/dependency_injection/container-paths';
export class ExpressServer implements Server {
    private app = express();

    setup(): http.Server {
        console.log('Starting Express server...');

        try {
            this.app.use(express.json());

            const customErrorMiddleware = Container.get<RequestHandler>(containerPaths.entryPoint.http.middleware.customError);
            const requestLoggerMiddleware = Container.get<RequestHandler>(containerPaths.entryPoint.http.middleware.requestLogger);

            useExpressServer(this.app, {
                defaultErrorHandler: false,
                controllers: Container.get(containerPaths.entryPoint.http.controllers),
                middlewares: [customErrorMiddleware, requestLoggerMiddleware],
            });

            this.app.get('/health', (_req, res) => {
                res.status(StatusCodes.OK).send(ReasonPhrases.OK);
            });

            // return this.app as http.Server<http.Request, http.Response>;
            return this.app as unknown as http.Server;
        } catch (error) {
            console.error(new ServerError('Could not set the controllers!'), { cause: error });
            throw new ServerError('Unable to setup the server.');
        }
    }

    async start(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.app.listen(port, () => resolve());
            } catch (error) {
                const context = { port };
                console.error(new ServerError('The server could not start listening on the provided port!'), { context, cause: error });
                reject(new ServerError('Unable to start the server.'));
            }
        });
    }
}
