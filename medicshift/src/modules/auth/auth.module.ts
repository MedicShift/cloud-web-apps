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
import { InviteModule } from '../invite/invites.module';
import { VerifyInviteHandler } from './queries/handlers/verify-invite.handler';

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  RefreshTokenHandler,
];

const QueryHandlers = [VerifyInviteHandler];

@Module({
  imports: [
    UsersModule,
    InviteModule,
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
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class AuthModule {}
