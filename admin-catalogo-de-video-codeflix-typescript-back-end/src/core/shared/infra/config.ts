import { config as readEnv } from 'dotenv';
import { join } from 'path';

export class Config {
  static env: any = null;

  static db() {
    Config.readEnv();

    return {
      dialect: Config.env.DB_VENDOR,
      host: Config.env.DB_HOST,
      port: Config.env.DB_PORT,
      username: Config.env.DB_USERNAME,
      password: Config.env.DB_PASSWORD,
      database: Config.env.DB_DATABASE,
      autoLoadModels: Config.env.DB_AUTO_LOAD_MODELS,
      storage: Config.env.DB_HOST,
      logging: Config.env.DB_LOGGING === 'true',
    };
  }

  static bucketName() {
    Config.readEnv();

    return Config.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME;
  }

  static googleCredentials() {
    Config.readEnv();

    return JSON.parse(Config.env.GOOGLE_CLOUD_CREDENTIALS);
  }

  static rabbitmqUri() {
    Config.readEnv();

    return Config.env.RABBITMQ_URI;
  }

  static readEnv() {
    if (Config.env) {
      return;
    }

    const { parsed } = readEnv({
      path: join(__dirname, `../../../../envs/.env.${process.env.NODE_ENV}`),
    });

    Config.env = {
      ...parsed,
      ...process.env,
    };
  }
}
