import { Entity } from "../../../../domain/entity";
import { Uuid } from "../../../../domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "./in-memory.repository";

class StubEntityConstructor {
  id: string;
  name: string;
  price: number;
}

class StubEntity extends Entity {
  id: Uuid
  name: string
  price: number

  constructor(props: StubEntityConstructor) {
    super();
    this.id = new Uuid(props.id);
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      price: this.price,
    };
  }
}

class stubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity, Uuid> {
  sortableFields: string[] = ['name'];

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }

  protected async applyFilter(itens: StubEntity[], filter: string | null): Promise<StubEntity[]> {
    if (!filter) {
      return itens;
    }

    return itens.filter((item) =>
      item.name.toLowerCase() === filter.toLowerCase() ||
      item.price.toString() === filter
    );
  }
}

describe('CategoryInMemoryRepository', () => {
  let repository: stubInMemorySearchableRepository;

  beforeEach(() => (
    repository = new stubInMemorySearchableRepository()
  ));

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      id: 'c4b8c4e0-1f2d-4a3b-8c4e-0f1a2b3c4d5e',
      name: 'Test',
      price: 100,
    });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities.length).toBe(1);
    expect(entities[0]).toStrictEqual(entity);
  });

  test('should bulk insert entities', async () => {
    const entity1 = new StubEntity({
      id: 'c4b8c4e0-1f2d-4a3b-8c4e-0f1a2b3c4d5e',
      name: 'Test',
      price: 100,
    });
    const entity2 = new StubEntity({
      id: 'c4b8c4e0-1f2d-4a3b-8c4e-0f1a2b3c4d5f',
      name: 'Test2',
      price: 200,
    });
    await repository.bulkInsert([entity1, entity2]);
    const entities = await repository.findAll();
    expect(entities.length).toBe(2);
    expect(entities[0]).toStrictEqual(entity1);
    expect(entities[1]).toStrictEqual(entity2);
  });

  test('should no filter items when filter object is null', async () => {
    const items = [
      new StubEntity({
        id: 'c4b8c4e0-1f2d-4a3b-8c4e-0f1a2b3c4d5e',
        name: 'Test',
        price: 100,
      })
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  test('should filter items using filter parameter', async () => {
    const items = [
      new StubEntity({
        id: '133ddd89-1b5c-47bf-91d4-ac60757e8b5e',
        name: 'TEST',
        price: 100,
      }),
      new StubEntity({
        id: '5a003a5a-59ae-4346-96f9-7a63988c673e',
        name: 'TEST',
        price: 200,
      }),
      new StubEntity({
        id: '4b09daff-dc2f-4b10-b5dc-b9241b8b5c30',
        name: 'Test3',
        price: 300,
      })
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, 'TEST');
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  test('should sort by created_at when sort param is null', async () => {
    const items = [
      new StubEntity({
        id: '133ddd89-1b5c-47bf-91d4-ac60757e8b5e',
        name: 'test3',
        price: 300,
      }),
      new StubEntity({
        id: '5a003a5a-59ae-4346-96f9-7a63988c673e',
        name: 'test1',
        price: 100,
      }),
      new StubEntity({
        id: '4b09daff-dc2f-4b10-b5dc-b9241b8b5c30',
        name: 'test2',
        price: 100,
      })
    ];

    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual(items);
  });

  it('should sort by name', async () => {
    const items = [
      new StubEntity({
        id: '133ddd89-1b5c-47bf-91d4-ac60757e8b5e',
        name: 'test3',
        price: 300,
      }),
      new StubEntity({
        id: '5a003a5a-59ae-4346-96f9-7a63988c673e',
        name: 'test1',
        price: 100,
      }),
      new StubEntity({
        id: '4b09daff-dc2f-4b10-b5dc-b9241b8b5c30',
        name: 'test2',
        price: 100,
      })
    ];

    let itemsSorted = await repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[1], items[2], items[0]]);

    itemsSorted = await repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[2], items[1]]);
  });
});
