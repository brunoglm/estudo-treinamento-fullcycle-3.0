import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CONFIG_SCHEMA_TYPE } from 'src/nest-modules/config/config.module';

const models = [CategoryModel];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        const dbVendor = configService.get('DB_VENDOR');
        if (dbVendor === 'sqlite') {
          return {
            dialect: dbVendor,
            host: configService.get('DB_HOST'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
            logging: configService.get('DB_LOGGING'),
            models,
          }
        }
        if (dbVendor === 'mysql') {
          return {
            dialect: dbVendor,
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
            database: configService.get('DB_DATABASE'),
            models,
          }
        }
        throw new Error(`DB_VENDOR ${dbVendor} not supported`);
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }
