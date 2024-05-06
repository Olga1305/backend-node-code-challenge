export interface Repository<Entity, EntityId> {
    save(data: Entity): Promise<void>;
    getAll(): Promise<Array<Entity>>;
    findById(id: EntityId): Promise<Entity | null>;
    delete(id: EntityId): Promise<void>;
}
