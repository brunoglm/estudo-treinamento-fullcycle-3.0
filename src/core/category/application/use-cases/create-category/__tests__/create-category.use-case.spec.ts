import { CategoryInMemoryRepository } from "@core/category/infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "../create-category.use-case";
import { EntityValidationError } from "@core/shared/domain/validators/validation.error";

describe('CreateCategoryUseCase Unit Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should throw an error when aggregate is not valid', async () => {
    const input = { name: 't'.repeat(256) };
    await expect(() => useCase.execute(input)).rejects.toThrow(
      new EntityValidationError(null),
    );
  });

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({ name: 'test' });
    let categoryList = await repository.findAll()
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: categoryList[0].category_id.value,
      name: 'test',
      description: null,
      is_active: true,
      created_at: categoryList[0].created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'some description',
      is_active: false,
    });
    categoryList = await repository.findAll()
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: categoryList[1].category_id.value,
      name: 'test',
      description: 'some description',
      is_active: false,
      created_at: categoryList[1].created_at,
    });
  });
});
