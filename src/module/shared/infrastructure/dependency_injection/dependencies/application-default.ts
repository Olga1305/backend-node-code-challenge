import { ServiceOptions } from 'typedi';

import entryPointDependencies from './entry_point/entry-point';

const dependencies: Array<ServiceOptions> = [
    ...entryPointDependencies,
];

export default dependencies;
