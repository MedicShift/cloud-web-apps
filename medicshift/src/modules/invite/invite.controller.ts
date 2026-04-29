import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InviteService } from './invite.service';
import { SendInviteDto } from './dtos/send-invite.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @Post()
  async sendInvite(@Body() dto: SendInviteDto, @CurrentUser('tenantId') tenantId: string) {
    return await this.inviteService.sendInvite(dto.email, tenantId, dto.role);
  }
}