import { CategoryOutput } from "@core/category/application/use-cases/common/category-output"
import { ListCategoriesOutput } from "@core/category/application/use-cases/list-category/list-categories.use-case"
import { Transform } from "class-transformer"
import { CollectionPresenter } from "../shared-module/collection.presenter"

export class CategoryPresenter {
  id: string
  name: string
  description: string | null
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date

  constructor(output: CategoryOutput) {
    this.id = output.id
    this.name = output.name
    this.description = output.description
    this.created_at = output.created_at
  }

  static serialize(output: CategoryOutput): CategoryPresenter {
    return new CategoryPresenter(output)
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter<CategoryPresenter> {
  data: CategoryPresenter[]

  constructor(output: ListCategoriesOutput) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map((item) => CategoryPresenter.serialize(item))
  }

  static serialize(output: ListCategoriesOutput): CategoryCollectionPresenter {
    return new CategoryCollectionPresenter(output)
  }
}
