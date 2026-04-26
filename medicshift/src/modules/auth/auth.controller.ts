import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { RegisterUserCommand } from './commands/impl/register-user.command';
import { LoginUserCommand } from './commands/impl/login-user.command';
import { RefreshTokenCommand } from './commands/impl/refresh-token.command';
import { LogoutCommand } from './commands/impl/logout.command';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute for auth endpoints
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  register(@Body() dto: RegisterDto) {
    return this.commandBus.execute(
      new RegisterUserCommand(
        dto.email,
        dto.password,
        dto.firstName,
        dto.lastName,
        dto.role,
        dto.tenantId,
      ),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user — returns access + refresh tokens' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account locked' })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.socket?.remoteAddress;
    return this.commandBus.execute(
      new LoginUserCommand(dto.email, dto.password, ip),
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'New access + refresh tokens issued',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refresh(@Body() dto: RefreshTokenDto, @CurrentUser() user: any) {
    return this.commandBus.execute(
      new RefreshTokenCommand(user.id, dto.refresh_token),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout — invalidates refresh token' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  logout(@CurrentUser() user: any) {
    return this.commandBus.execute(new LogoutCommand(user.id));
  }
}
