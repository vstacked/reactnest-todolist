import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TaskModule } from './task/task.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST ?? 'localhost',
      port: Number(process.env.PGPORT ?? '5434'),
      username: process.env.PGUSER ?? 'postgres',
      password: process.env.PGPASSWORD ?? 'postgres',
      database: process.env.PGDATABASE ?? 'postgres',
      autoLoadEntities: true,
      synchronize: true, //* Development only, set to false in production
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        //* REDIS_TTL is in seconds, cache-manager expects milliseconds
        ttl: Number(process.env.REDIS_TTL) * 1000,
        stores: [
          createKeyv(
            `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
          ),
        ],
      }),
    }),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
