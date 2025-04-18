import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';

@Controller('categories')
export class CategoriesController {
  constructor(private repo: CategorySequelizeRepository) {
    console.log(this.repo);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return {} as any
  }

  @Get()
  findAll() {
    return {} as any
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {} as any
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return {} as any
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return {} as any
  }
}
