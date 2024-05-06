import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../../../shared/infrastructure/http/error/HttpError';

export class AccountOperationsHttpControllerUnprocessableEntityError extends HttpError {
    constructor(message: string, error?: Error) {
        super(StatusCodes.UNPROCESSABLE_ENTITY, message, error);
    }
}
