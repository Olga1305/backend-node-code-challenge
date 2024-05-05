import express, { Express, Request, Response } from "express";
import { Server } from "http";


export class App {
    public readonly express: Express = express();

    private readonly port: number;

    private server: Server | undefined;

    constructor(port: number) {
        this.port = port;
    }

    start(): void {
        this.express.get('/dummy', (_request: Request, response: Response) => {
            response.send('something!')
        })

        this.server = this.express.listen(this.port)
    }

    stop(): void {
        this.server?.close();
    }
}
