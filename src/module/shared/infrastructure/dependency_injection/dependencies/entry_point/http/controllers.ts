import path from 'path';
import { ServiceOptions } from 'typedi';
import containerPaths from '../../../../../application/ports/dependency_injection/container-paths';

const dependencies: Array<ServiceOptions> = [
    { id: containerPaths.entryPoint.http.controllers, value: [path.join(__dirname, '../../../../../../../module/**/**/*HttpController.{ts,js}')] },
];

export default dependencies;
