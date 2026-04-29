import { Module } from '@nestjs/common';
import { InviteController } from './invite.controller';
import { MailModule } from '../../infrastructure/mail/mail.module';
import { InviteService } from './invite.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Module({
    imports: [MailModule, JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('app.jwtSecret') as string,
            signOptions: {
                expiresIn: configService.get<string>('app.jwtExpiration') as StringValue,
            },
        }),
    }),],
    controllers: [InviteController],
    providers: [InviteService],
    exports: [InviteService]

})
export class InviteModule { }