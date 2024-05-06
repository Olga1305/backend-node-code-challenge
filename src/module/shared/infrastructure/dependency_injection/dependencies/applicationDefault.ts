import { ServiceOptions } from 'typedi';

import entryPointDependencies from './entry_point/entryPoint';
import bankAccountDependencies from './module/bank_account/bankAccount';

const dependencies: Array<ServiceOptions> = [...entryPointDependencies, ...bankAccountDependencies];

export default dependencies;
