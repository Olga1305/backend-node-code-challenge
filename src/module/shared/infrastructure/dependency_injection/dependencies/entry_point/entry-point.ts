import { ServiceOptions } from 'typedi';

import controllerDependencies from './http/controllers';
import middlewareDependencies from './http/middlewares';
import serverDependencies from './http/server';

const dependencies: Array<ServiceOptions> = [
    ...controllerDependencies,
    ...middlewareDependencies, 
    ...serverDependencies, 
];

export default dependencies;
