import { IUseCase } from "../../shared/application/use-case.interface";
import { SortDirection } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { CategoryFilter, CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../domain/category.repository";


export class ListCategoriesUseCase
  implements IUseCase<ListCategoriesInput, ListCategoriesOutput> {
  constructor(private categoryRepo: ICategoryRepository) { }

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input);
    const searchResult = await this.categoryRepo.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
    const { items: _items } = searchResult;
    const items = _items.map((category) => {
      return {
        id: category.id.value,
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        created_at: category.created_at,
      }
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    props: Omit<SearchResult, 'items'>,
  ): PaginationOutput<Item> {
    return {
      items,
      total: props.total,
      current_page: props.current_page,
      last_page: props.last_page,
      per_page: props.per_page,
    };
  }
}

export type ListCategoriesInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter | null;
};

export type CategoryOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
};

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;
