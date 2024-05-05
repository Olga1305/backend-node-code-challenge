import { ServiceOptions } from 'typedi';
import { CustomErrorMiddleware } from '../../../../http/server/express/CustomErrorMiddleware';
import { RequestLoggerMiddleware } from '../../../../http/server/express/RequestLoggerMiddleware';
import containerPaths from '../../../../../application/ports/dependency_injection/container-paths';

const dependencies: Array<ServiceOptions> = [
    { id: containerPaths.entryPoint.http.middleware.customError, value: CustomErrorMiddleware },
    { id: containerPaths.entryPoint.http.middleware.requestLogger, value: RequestLoggerMiddleware },
];

export default dependencies;
