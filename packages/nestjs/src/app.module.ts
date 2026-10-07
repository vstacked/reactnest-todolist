import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TaskModule } from './task/task.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvirontmentVariables, validate } from './config/env.validation.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'nestjs',
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true, //* docker-compose already injects .env.dev
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvirontmentVariables, true>) => ({
        type: 'postgres',
        host: config.get('PGHOST', { infer: true }),
        port: config.get('PGPORT', { infer: true }),
        username: config.get('PGUSER', { infer: true }),
        password: config.get('PGPASSWORD', { infer: true }),
        database: config.get('PGDATABASE', { infer: true }),
        autoLoadEntities: true,
        synchronize: false,
        migrations: [import.meta.dirname + '/migrations/*{.js,.ts}'],
        migrationsRun: true,
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvirontmentVariables, true>) => {
        const host = config.get('REDIS_HOST', { infer: true });
        const port = config.get('REDIS_PORT', { infer: true });
        const password = encodeURIComponent(
          config.get('REDIS_PASSWORD', { infer: true }),
        );
        return {
          //* REDIS_TTL is in seconds, cache-manager expects milliseconds
          ttl: config.get('REDIS_TTL', { infer: true }) * 1000,
          stores: [createKeyv(`redis://:${password}@${host}:${port}`)],
        };
      },
    }),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
