import { InvalidUUIDError, Uuid } from "../uuid.vo";
import { validate as uuidValidate } from 'uuid';

describe('Uuid Unit Tests', () => {
  let validateSpy: jest.SpyInstance;

  beforeEach(() => {
    validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should throw error when uuid is invalid', () => {
    expect(() => new Uuid('invalid-uuid')).toThrow(new InvalidUUIDError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should create a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid.value).toBeDefined();
    expect(uuidValidate(uuid.value)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should accept a valid uuid', () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    const uuid = new Uuid(validUuid);
    expect(uuid.value).toBe(validUuid);
    expect(uuidValidate(uuid.value)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});

