export interface DbClient {
    connect(): unknown;
    disconnect(): Promise<void>;
}
