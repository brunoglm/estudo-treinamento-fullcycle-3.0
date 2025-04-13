import { IUseCase } from "../../shared/application/use-case.interface";
import { NotFoundError } from "../../shared/domain/errors/not-found.error";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "../domain/category.entity";
import { ICategoryRepository } from "../domain/category.repository";

export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryUseCaseInput, UpdateCategoryUseCaseOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) { }

  async execute(input: UpdateCategoryUseCaseInput): Promise<UpdateCategoryUseCaseOutput> {
    const categoryId = new Uuid(input.id);

    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && category.changeName(input.name);

    input.description && category.changeDescription(input.description);

    if (input.is_active === true) {
      category.activate();
    }

    if (input.is_active === false) {
      category.deactivate();
    }

    await this.categoryRepository.update(category);

    return {
      id: category.id.value,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    }
  }
}

export type UpdateCategoryUseCaseInput = {
  id: string;
  name?: string;
  description?: string | null;
  is_active?: boolean | null;
}

export type UpdateCategoryUseCaseOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
};
