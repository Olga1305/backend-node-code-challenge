type Service<T> = T;
type ServiceId = string;

export default interface IocContainer {
    init(): void;
    get<T>(serviceId: ServiceId): Service<T>;
    set(serviceId: ServiceId, service: Service<unknown>): void;
    remove(serviceId: ServiceId): void;
    reset(): void;
}
