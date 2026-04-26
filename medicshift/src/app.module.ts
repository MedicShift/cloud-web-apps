import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HospitalsModule } from './modules/hospitals/hospitals.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { HealthModule } from './modules/health/health.module';
import { AuditLogModule } from './common/audit/audit-log.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule,

    // Structured JSON logging (Pino)
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true, singleLine: true },
              }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),

    // Global rate limiting — 100 requests per 60 seconds default
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database') as TypeOrmModuleOptions,
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    HospitalsModule,
    DepartmentsModule,
    ShiftsModule,
    SchedulesModule,

    // Infrastructure modules
    HealthModule,
    AuditLogModule,
  ],
  controllers: [],
  providers: [
    // Register ThrottlerGuard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
