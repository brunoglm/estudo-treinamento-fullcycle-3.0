import { Entity } from "../../domain/entity";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { IRepository } from "../../domain/repository/repository-interface";
import { ValueObject } from "../../domain/value-object";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject<any>> implements IRepository<E, EntityId> {
  private items: Map<string, E> = new Map();

  async insert(item: E): Promise<void> {
    this.items.set(item.id.value, item);
  }

  async bulkInsert(items: E[]): Promise<void> {
    items.forEach((item) => {
      this.items.set(item.id.value, item);
    });
  }

  async update(item: E): Promise<void> {
    const i = await this.findById(item.id as EntityId);
    if (!i) {
      throw new NotFoundError(item.id.value, this.getEntity());
    }
    this.items.set(item.id.value, item);
  }

  async delete(id: EntityId): Promise<void> {
    const item = await this.findById(id as EntityId);
    if (!item) {
      throw new NotFoundError(id.value, this.getEntity());
    }
    this.items.delete(id.value);
  }

  async findById(id: EntityId): Promise<E | null> {
    return this.items.get(id.value) || null;
  }

  async findAll(): Promise<E[]> {
    return Array.from(this.items.values());
  }

  abstract getEntity(): new (...args: any[]) => E
}
