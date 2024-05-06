import { CustomError } from '../../../domain/error/CustomError';

export class HttpError extends CustomError {
    constructor(
        public status: number,
        message: string,
        error?: Error
    ) {
        super(message, { cause: error });

        if (error instanceof CustomError) this.name = error.constructor.name; // otherwise name will be generic 'HttpError'
    }
}
