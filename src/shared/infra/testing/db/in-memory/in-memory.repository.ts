import { Entity } from "../../../../domain/entity";
import { NotFoundError } from "../../../../domain/errors/not-found.error";
import { IRepository, ISearchableRepository } from "../../../../domain/repository/repository-interface";
import { SearchParams, SortDirection } from "../../../../domain/repository/search-params";
import { SearchResult } from "../../../../domain/repository/search-result";
import { ValueObject } from "../../../../domain/value-object";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject<any>> implements IRepository<E, EntityId> {
  protected items: Map<string, E> = new Map();

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

export abstract class InMemorySearchableRepository<
  E extends Entity,
  EntityId extends ValueObject<any>,
  Filter = string
>
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter> {
  sortableFields: string[] = [];
  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const itensFiltered = await this.applyFilter(Array.from(this.items.values()), props.filter);
    const itensSorted = this.applySort(itensFiltered, props.sort, props.sort_dir);
    const itensPaginated = this.applyPagination(itensSorted, props.page, props.per_page);
    return new SearchResult({
      items: itensPaginated,
      total: itensFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(itens: E[], filter: Filter | null): Promise<E[]>;

  protected applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: string, item: E) => any,
  ): E[] {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      //@ts-ignore
      const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
      //@ts-ignore
      const bValue = custom_getter ? custom_getter(sort, b) : b[sort];
      if (aValue < bValue) {
        return sort_dir === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return sort_dir === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }

  protected applyPagination(itens: E[], page: SearchParams['page'], per_page: SearchParams['per_page']): E[] {
    const start = (page - 1) * per_page;
    const limit = start + per_page;
    return itens.slice(start, limit);
  }
}
