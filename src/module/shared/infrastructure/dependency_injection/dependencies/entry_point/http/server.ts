import { ServiceOptions } from 'typedi';
import { ExpressServer } from '../../../../http/server/express/ExpressServer';

const dependencies: Array<ServiceOptions> = [
    { id: 'EntryPoint.Http.Server', type: ExpressServer },
];

export default dependencies;
