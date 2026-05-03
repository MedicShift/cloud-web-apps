import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendInviteDto } from './dtos/send-invite.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SendInviteCommand } from './commands/impl/send-invite.command';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invite')
export class InviteController {
  constructor(private readonly commandBus: CommandBus) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  sendInvite(
    @Body() dto: SendInviteDto,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('id') invitedBy: string,
  ) {
    return this.commandBus.execute(
      new SendInviteCommand(
        dto.email,
        tenantId,
        invitedBy,
        dto.role,
        dto.departmentId,
      ),
    );
  }
}
