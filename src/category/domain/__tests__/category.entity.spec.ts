import { EntityValidationError } from '../../../shared/domain/validators/validation.error';
import { Category } from '../category.entity';

describe('Category Unit Tests', () => {
  let validateSpy: jest.SpyInstance;

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate');
  });

  describe('create command', () => {
    test('constructor', () => {
      const category = new Category({
        name: 'Movie',
      });

      expect(category.category_id).toBeDefined();
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test('should create a category', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'A movie category',
        is_active: true,
      });

      expect(category.category_id).toBeDefined();
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('A movie category');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should throw error when name is empty', () => {
      expect(() => Category.create({
        name: null,
      })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('change name method', () => {
    test('should change name', () => {
      const category = new Category({
        name: 'Movie',
      });

      category.changeName('Documentary');

      expect(category.name).toBe('Documentary');
    });
  });

  describe('change description method', () => {
    test('should change description', () => {
      const category = new Category({
        name: 'Movie',
      });

      category.changeDescription('A movie category');

      expect(category.description).toBe('A movie category');
    });
  })

  describe('activate method', () => {
    test('should activate category', () => {
      const category = new Category({
        name: 'Movie',
        is_active: false,
      });

      category.activate();

      expect(category.is_active).toBeTruthy();
    });
  })

  describe('deactivate method', () => {
    test('should deactivate category', () => {
      const category = new Category({
        name: 'Movie',
        is_active: true,
      });

      category.deactivate();

      expect(category.is_active).toBeFalsy();
    });
  })

  describe('toJSON method', () => {
    test('should convert category to JSON', () => {
      const category = new Category({
        name: 'Movie',
        description: 'A movie category',
        is_active: true,
      });

      const json = category.toJSON();

      expect(json).toEqual({
        category_id: category.category_id.value,
        name: 'Movie',
        description: 'A movie category',
        is_active: true,
        created_at: category.created_at,
      });
    });
  })

  describe('category_id field', () => {
    const arrange = [
      { category_id: undefined },
      { category_id: null },
      { category_id: '123e4567-e89b-12d3-a456-426614174000' },
    ];
    test.each(arrange)('id = %j', ({ category_id }) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any,
      });

      expect(category.category_id.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  })
})
