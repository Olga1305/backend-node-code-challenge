import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { ValidationDomainError } from '../../../../domain/model/errors/ValidationDomainError';
import { HttpError } from '../../error/HttpError';
import { NotFoundDomainError } from '../../../../domain/error/NotFoundDomainError';
import { CustomError } from '../../../../domain/error/CustomError';
import { ValidationApplicationError } from '../../../../application/error/ValidationApplicationError';
import { DomainValueTypeError } from '../../../../domain/model/errors/DomainValueTypeError';
import { UndefinedDomainValueError } from '../../../../domain/model/errors/UndefinedDomainValueError';

@Middleware({ type: 'after' })
export class CustomErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: HttpError | Error, _: Request, response: Response, next: (err?: unknown) => unknown) {
        const timestamp = new Date().toISOString();
        console.error(`CustomErrorMiddleware: ERROR [${timestamp}] ${JSON.stringify(error)}`);
        if (error instanceof Error) {
            if (error.name === 'ParamNormalizationError') {
                response.status(StatusCodes.BAD_REQUEST).send(error);
            }
        }
        if (error instanceof HttpError) {
            response.status(error.status).send(error);
        } else if (
            this.wasErrorCausedBy(error, DomainValueTypeError) ||
            this.wasErrorCausedBy(error, UndefinedDomainValueError) ||
            this.wasErrorCausedBy(error, ValidationDomainError) ||
            this.wasErrorCausedBy(error, ValidationApplicationError)
        ) {
            response.status(StatusCodes.BAD_REQUEST).send(error);
        } else if (this.wasErrorCausedBy(error, NotFoundDomainError)) {
            response.status(StatusCodes.NOT_FOUND).send(error);
        } else {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
        next();
    }

    private wasErrorCausedBy<T>(error: unknown, typeConstructor: new (str: string) => T): boolean {
        if (error && error instanceof CustomError) {
            return error instanceof typeConstructor || this.wasErrorCausedBy(error.cause, typeConstructor);
        }
        return false;
    }
}
