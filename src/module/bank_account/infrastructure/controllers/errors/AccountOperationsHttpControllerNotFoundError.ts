import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../../../shared/infrastructure/http/error/HttpError';

export class AccountOperationsHttpControllerNotFoundError extends HttpError {
    constructor(message?: string) {
        super(StatusCodes.NOT_FOUND, message ?? 'Flight Data not found');
    }
}
