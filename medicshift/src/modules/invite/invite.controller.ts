import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SendInviteDto } from './dtos/send-invite.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SendInviteCommand } from './commands/impl/send-invite.command';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('invite')
export class InviteController {
  constructor(private readonly commandBus: CommandBus) {}

  @RequirePermissions(Permission.INVITES_CREATE)
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
        dto.roleId,
        dto.departmentId,
      ),
    );
  }
}
