import { Entity } from "../../../domain/entity";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "./in-memory.repository";

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

class stubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }
}

describe('CategoryInMemoryRepository', () => {
  let repository: stubInMemoryRepository;

  beforeEach(() => (
    repository = new stubInMemoryRepository()
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
});
