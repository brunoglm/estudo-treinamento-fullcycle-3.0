import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { InvalidUUIDError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryUseCase } from "../get-category.use-case";


describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
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

  it('should returns a category', async () => {
    const entity = Category.create({ name: 'Movie' });
    repository['items'].set(entity.category_id.value, entity);
    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: entity.category_id.value });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.category_id.value,
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });
  });
});
