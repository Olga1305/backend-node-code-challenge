import { startHttpServerEntryPoint } from './entry_point/http-server-entry-point';

(async () => {
    console.log(`

            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            bank-account app is starting...

    `);

    await startHttpServerEntryPoint();

    console.log(`

            bank-account app started successfully!
            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    `);
})();
