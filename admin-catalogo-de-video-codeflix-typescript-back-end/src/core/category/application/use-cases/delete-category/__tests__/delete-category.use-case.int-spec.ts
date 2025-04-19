import { setupSequelize } from '@core/shared/infra/db/helpers';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { DeleteCategoryUseCase } from '../delete-category.use-case';
import { Category } from '@core/category/domain/category.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CategoryFakeBuilder } from '@core/category/domain/category-fake.builder';

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const categoryId = new Uuid();
    await expect(() => useCase.execute({ id: categoryId.value })).rejects.toThrow(
      new NotFoundError(categoryId.value, Category),
    );
  });

  it('should delete a category', async () => {
    const category = CategoryFakeBuilder.aCategory().build();
    await repository.insert(category);
    await useCase.execute({
      id: category.category_id.value,
    });
    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });
});
