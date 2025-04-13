import { IUseCase } from "../../../shared/application/use-case.interface";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";

export class CreateCategoryUseCase implements IUseCase<CreateCategoryUseCaseInput, CreateCategoryUseCaseOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) { }

  async execute(input: CreateCategoryUseCaseInput): Promise<CreateCategoryUseCaseOutput> {
    const category = Category.create(input);
    await this.categoryRepository.insert(category);
    return CategoryOutputMapper.toOutput(category);
  }
}

export type CreateCategoryUseCaseInput = {
  name: string;
  description?: string | null;
  is_active?: boolean | null;
}

export type CreateCategoryUseCaseOutput = CategoryOutput
