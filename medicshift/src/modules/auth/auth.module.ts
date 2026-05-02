import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RegisterUserHandler } from './commands/handlers/register-user.handler';
import { LoginUserHandler } from './commands/handlers/login-user.handler';
import { RefreshTokenHandler } from './commands/handlers/refresh-token.handler';
import { LogoutHandler } from './commands/handlers/logout.handler';

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  RefreshTokenHandler,
  LogoutHandler,
];

@Module({
  imports: [
    UsersModule,
    PassportModule,
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtSecret'),
        signOptions: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          expiresIn: configService.get<string>('app.jwtExpiration') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, JwtRefreshStrategy, ...CommandHandlers],
})
export class AuthModule {}
