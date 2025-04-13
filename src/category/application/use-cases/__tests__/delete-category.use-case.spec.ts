import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { InvalidUUIDError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../delete-category.use-case";



describe('DeleteCategoryUseCase Unit Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUUIDError(),
    );

    const categoryId = new Uuid();

    await expect(() => useCase.execute({ id: categoryId.value })).rejects.toThrow(
      new NotFoundError(categoryId.value, Category),
    );
  });

  it('should delete a category', async () => {
    const entity = new Category({ name: 'test 1' });
    repository['items'].set(entity.category_id.value, entity);
    await useCase.execute({
      id: entity.category_id.value,
    });
    expect(repository['items'].size).toBe(0);
  });
});
