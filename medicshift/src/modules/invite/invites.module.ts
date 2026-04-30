import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';

import { InviteController } from './invite.controller';
import { Invite } from './entities/invite.entity';
import { InviteRepository } from './repositories/invite.repository';
import { SendInviteHandler } from './commands/handlers/send-invite.handler';
import { MailModule } from '../../infrastructure/mail/mail.module';

const CommandHandlers = [SendInviteHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([Invite]),
    CqrsModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('app.jwtExpiration') as StringValue,
        },
      }),
    }),
  ],
  controllers: [InviteController],
  providers: [InviteRepository, ...CommandHandlers],
  exports: [InviteRepository],
})
export class InviteModule {}
