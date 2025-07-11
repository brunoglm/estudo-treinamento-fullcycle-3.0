import { CreateCategoryUseCase } from '@core/category/application/use-cases/create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/use-cases/list-category/list-categories.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update-category/update-category.use-case';
import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CategoryCollectionPresenter, CategoryPresenter } from './categories.presenter';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoriesDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase

  @Inject(ListCategoriesUseCase)
  private listUseCase: ListCategoriesUseCase

  constructor() { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto)
    return CategoryPresenter.serialize(output)
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const output = await this.updateUseCase.execute({
      id,
      ...updateCategoryDto,
    })
    return CategoryPresenter.serialize(output)
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    return this.deleteUseCase.execute({ id })
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    const output = await this.getUseCase.execute({ id })
    return CategoryPresenter.serialize(output)
  }

  @Get()
  async search(@Query() searchCategoriesDto: SearchCategoriesDto) {
    const output = await this.listUseCase.execute(searchCategoriesDto)
    return CategoryCollectionPresenter.serialize(output)
  }
}
