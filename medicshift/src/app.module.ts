import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { HealthModule } from './modules/health/health.module';
import { AuditLogModule } from './common/audit/audit-log.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { TenantsModule } from './modules/tenants/tenants.module';
import { TenantMiddleware } from './middleware/tenant.middleware';
import { UserSubscriber } from './modules/users/subscribers/user.subscriber';
import { InviteModule } from './modules/invite/invites.module';

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
                options: { colorize: true },
              }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        serializers: {
          req(req: { id: string; method: string; url: string }) {
            return { id: req.id, method: req.method, url: req.url };
          },
          res(res: { statusCode: number }) {
            return { statusCode: res.statusCode };
          },
        },
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
      useFactory: (configService: ConfigService) => ({
        ...(configService.get('database') as TypeOrmModuleOptions),
        subscribers: [UserSubscriber],
      }),
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    TenantsModule,
    DepartmentsModule,
    ShiftsModule,
    SchedulesModule,

    // Infrastructure modules
    HealthModule,
    AuditLogModule,
    InviteModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes(
        { path: 'hospital', method: RequestMethod.ALL },
        { path: 'department', method: RequestMethod.ALL },
      );
  }
}
