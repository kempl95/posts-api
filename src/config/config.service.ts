import { DataSource, DataSourceOptions } from 'typeorm';

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('DATABASE_PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): DataSourceOptions {
    const DATABASE_TYPE: any = String(process.env.DATABASE_TYPE) || 'postgres';
    return {
      type: DATABASE_TYPE,

      host: this.getValue('DATABASE_HOST'),
      port: parseInt(this.getPort()),
      username: this.getValue('DATABASE_USER'),
      password: this.getValue('DATABASE_PASSWORD'),
      database: this.getValue('DATABASE_NAME'),

      entities: ['**/*.model{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['./src/migration/*.ts'],

      logging: true,

      ssl: this.isProduction(),
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DATABASE_TYPE',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME'
]);

const connectionSource = new DataSource(configService.getTypeOrmConfig());

export { configService, connectionSource };
