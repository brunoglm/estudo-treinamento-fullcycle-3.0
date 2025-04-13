import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { InvalidUUIDError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../update-category.use-case";


describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake' }),
    ).rejects.toThrow(new InvalidUUIDError());

    const categoryId = new Uuid();

    await expect(() =>
      useCase.execute({ id: categoryId.value, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(categoryId.value, Category));
  });

  it('should throw an error when aggregate is not valid', async () => {
    const aggregate = new Category({ name: 'Movie' });
    repository['items'].set(aggregate.category_id.value, aggregate);
    await expect(() =>
      useCase.execute({
        id: aggregate.category_id.value,
        name: 't'.repeat(256),
      }),
    ).rejects.toThrow(new EntityValidationError(null, 'Entity validation error'));
  });

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new Category({ name: 'Movie' });
    repository['items'].set(entity.category_id.value, entity);

    let output = await useCase.execute({
      id: entity.category_id.value,
      name: 'test',
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.category_id.value,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.category_id.value,
          name: 'test',
          description: 'some description',
        },
        expected: {
          id: entity.category_id.value,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.value,
          name: 'test',
        },
        expected: {
          id: entity.category_id.value,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.value,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: entity.category_id.value,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.value,
          name: 'test',
        },
        expected: {
          id: entity.category_id.value,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.value,
          name: 'test',
          is_active: true,
        },
        expected: {
          id: entity.category_id.value,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.value,
          name: 'test',
          description: 'some description',
          is_active: false,
        },
        expected: {
          id: entity.category_id.value,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('is_active' in i.input && { is_active: i.input.is_active }),
      });
      expect(output).toStrictEqual({
        id: entity.category_id.value,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
