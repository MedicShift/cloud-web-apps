import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendInviteCommand } from '../impl/send-invite.command';
import { InviteRepository } from '../../repositories/invite.repository';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { inviteTemplate } from 'src/infrastructure/mail/templates/invite.template';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/modules/users/enums/user-role.enum';
import { InviteStatus } from '../../enums/invite-status';
import { Invite } from '../../entities/invite.entity';

@CommandHandler(SendInviteCommand)
export class SendInviteHandler implements ICommandHandler<SendInviteCommand> {
  constructor(
    private readonly inviteRepository: InviteRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async execute(command: SendInviteCommand): Promise<Invite> {
    const { email, tenantId, invitedBy, role } = command;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const invite = await this.inviteRepository.createInvite({
      email,
      tenantId,
      invitedBy,
      role: role ?? UserRole.USER,
      status: InviteStatus.PENDING,
      expiresAt,
    });

    const emailTo = process.env.EMAIL_TO;
    const inviteToken = this.jwtService.sign({ email, role, tenantId });
    const inviteLink = `${process.env.FRONTEND_URL}?token=${inviteToken}`;

    if (!emailTo) {
      throw new Error('EMAIL_TO is not defined');
    }

    await this.mailService.sendEmail({
      to: emailTo,
      subject: 'You are invited',
      html: inviteTemplate('medshift', inviteLink),
    });

    return invite;
  }
}
