import { IUseCase } from "../../shared/application/use-case.interface";
import { Category } from "../domain/category.entity";
import { ICategoryRepository } from "../domain/category.repository";

export class CreateCategoryUseCase implements IUseCase<CreateCategoryUseCaseInput, CreateCategoryUseCaseOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) { }

  async execute(input: CreateCategoryUseCaseInput): Promise<CreateCategoryUseCaseOutput> {
    const category = Category.create(input);
    await this.categoryRepository.insert(category);
    return {
      id: category.id.value,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    }
  }
}

export type CreateCategoryUseCaseInput = {
  name: string;
  description?: string | null;
  is_active?: boolean | null;
}

export type CreateCategoryUseCaseOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
};
