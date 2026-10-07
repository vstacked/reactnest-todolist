import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { validate } from './config/env.validation.js';

//* Used by the TypeORM CLI only (see the migration:* scripts in package.json).
//* The CLI runs outside of NestJS, so it cannot use ConfigService.
const env = validate(process.env);

export default new DataSource({
  type: 'postgres',
  host: env.PGHOST,
  port: env.PGPORT,
  username: env.PGUSER,
  password: env.PGPASSWORD,
  database: env.PGDATABASE,
  entities: [import.meta.dirname + '/**/*.entity{.ts,.js}'],
  migrations: [import.meta.dirname + '/migrations/*{.ts,.js}'],
});
