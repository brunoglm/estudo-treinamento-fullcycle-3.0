import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityValidationErrorFilter } from './nest-modules/shared-module/filters/entity-validation-error.filter';
import { NotFoundErrorFilter } from './nest-modules/shared-module/filters/not-found-error.filter';
import { WrapperDataInterceptor } from './nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    })
  )

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new WrapperDataInterceptor()
  )

  app.useGlobalFilters(
    new NotFoundErrorFilter(),
    new EntityValidationErrorFilter()
  )

  await app.listen(3000);
}
bootstrap();
