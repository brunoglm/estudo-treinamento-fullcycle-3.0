import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../../shared/infra/testing/db/in-memory/in-memory.repository";
import { Category } from "../../../domain/category.entity";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<Category, Uuid> {
  sortableFields: string[] = ['name', 'created_at'];

  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  protected async applyFilter(itens: Category[], filter: string | null): Promise<Category[]> {
    if (!filter) {
      return itens;
    }

    return itens.filter((item) =>
      item.name.toLowerCase() === filter.toLowerCase()
    );
  }

  protected applySort(itens: Category[], sort: string | null, sort_dir: SortDirection | null): Category[] {
    return sort ? super.applySort(itens, sort, sort_dir) :
      super.applySort(itens, 'created_at', 'desc');
  }
}
