import { Category } from '../../../domain/category.entity';
import { CategoryModel } from './category.model';

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.category_id.value,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const category = new Category({
      category_id: model.category_id,
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    });

    category.validate();
    return category;
  }
}
