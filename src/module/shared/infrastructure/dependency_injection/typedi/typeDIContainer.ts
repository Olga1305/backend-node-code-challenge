import 'reflect-metadata';
import Container, { ServiceOptions } from 'typedi';
import { ContainerError } from '../../../application/ports/dependency_injection/ContainerError';
import defaultDependencies from '../dependencies/applicationDefault';
import IocContainer from '../../../application/ports/dependency_injection/IocContainer';
import config from '../../config/config';

class _typeDIContainer implements IocContainer {
    private container = Container;

    init() {
        const { NODE_ENV } = config;
        const env = NODE_ENV || 'development';
        try {
            this.applyDependencies(defaultDependencies);
        } catch (error) {
            const context = { env };
            console.error(new ContainerError('Could not set the dependencies!'), { context, cause: error });
            throw new ContainerError('Unable to start the app.');
        }

        return this as IocContainer;
    }

    get<T>(serviceId: string): T {
        return this.container.get(serviceId);
    }

    set(serviceId: string, service: unknown): void {
        this.container.set(serviceId, service);
    }

    remove(serviceId: string): void {
        this.container.remove(serviceId);
    }

    reset(): void {
        this.container.reset();
    }

    private applyDependencies(dependencies: Array<ServiceOptions>) {
        if (!dependencies.length) return;
        for (const dependency of dependencies) {
            Container.set(dependency);
        }
    }
}

export const typeDiContainer = new _typeDIContainer().init();
