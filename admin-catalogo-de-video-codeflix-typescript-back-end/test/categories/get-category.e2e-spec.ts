import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import * as CategoryProviders from '../../src/nest-modules/categories-module/categories.providers';
import { CategoryOutputMapper } from '../../src/core/category/application/use-cases/common/category-output';
import { GetCategoryFixture } from '../../src/nest-modules/categories-module/testing/category-fixture';
import { CategoryPresenter } from 'src/nest-modules/categories-module/categories.presenter';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { CategoryFakeBuilder } from '@core/category/domain/category-fake.builder';

describe('CategoriesController (e2e)', () => {
  const nestApp = startApp();
  describe('/categories/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Category Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/categories/${id}`)
          // .authenticate(nestApp.app)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a category ', async () => {
      const categoryRepo = nestApp.app.get<ICategoryRepository>(
        CategoryProviders.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = CategoryFakeBuilder.aCategory().build();
      await categoryRepo.insert(category);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/categories/${category.category_id.value}`)
        // .authenticate(nestApp.app)
        .expect(200);
      const keyInResponse = GetCategoryFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = CategoryPresenter.serialize(
        CategoryOutputMapper.toOutput(category),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
