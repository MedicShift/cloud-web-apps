import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendInviteCommand } from '../impl/send-invite.command';
import { InviteRepository } from '../../repositories/invite.repository';
import { MailService } from '../../../../infrastructure/mail/mail.service';
import { inviteTemplate } from '../../../../infrastructure/mail/templates/invite.template';
import { JwtService } from '@nestjs/jwt';

import { InviteStatus } from '../../enums/invite-status';
import { Invite } from '../../entities/invite.entity';
import { NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../../../roles/repositories/role.repository';

@CommandHandler(SendInviteCommand)
export class SendInviteHandler implements ICommandHandler<SendInviteCommand> {
  constructor(
    private readonly inviteRepository: InviteRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly roleRepository: RoleRepository,
  ) {}

  async execute(command: SendInviteCommand): Promise<Invite> {
    const { email, tenantId, departmentId, invitedBy, roleId, roleName } =
      command;

    let resolvedRoleId = roleId;
    if (!resolvedRoleId) {
      const nameToSearch = roleName || 'User';
      const defaultRole = await this.roleRepository.findByNameAndTenant(
        nameToSearch,
        tenantId,
      );
      if (!defaultRole)
        throw new NotFoundException(`Role ${nameToSearch} not found`);
      resolvedRoleId = defaultRole.id;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const invite = await this.inviteRepository.createInvite({
      email,
      tenantId,
      invitedBy,
      roleId: resolvedRoleId,
      status: InviteStatus.PENDING,
      expiresAt,
    });

    const emailTo = process.env.EMAIL_TO;
    const inviteToken = this.jwtService.sign({
      email,
      roleId: resolvedRoleId,
      tenantId,
      departmentId,
    });
    const inviteLink = `${process.env.FRONTEND_URL}/auth/register?token=${inviteToken}`;

    if (!emailTo) {
      throw new NotFoundException('EMAIL_TO is not defined');
    }

    await this.mailService.sendEmail({
      to: emailTo,
      subject: 'You are invited',
      html: inviteTemplate('medshift', inviteLink),
    });

    return invite;
  }
}
