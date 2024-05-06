import Container from '../module/shared/application/ports/dependency_injection/Container';
import containerPaths from '../module/shared/application/ports/dependency_injection/container-paths';
import config from '../module/shared/infrastructure/config/config';
import { Server } from '../module/shared/infrastructure/http/server/Server';

export async function startHttpServerEntryPoint() {
    const server: Server = Container.get(containerPaths.entryPoint.http.server);
    server.setup();

    const { PORT } = config;

    const port = PORT || 3300;
    await server.start(port);

    const currentDate = new Date();
    console.log(`

            ------------
            Server started successfully!!

            Timestamp in ms: ${currentDate.getTime()}
            Current date and time: ${currentDate}

            Http: http://localhost:${port}
            Health: http://localhost:${port}/health
            ------------

    `);
}
