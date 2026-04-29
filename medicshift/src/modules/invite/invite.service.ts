import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { MailService } from '../../infrastructure/mail/mail.service';
import { inviteTemplate } from '../../infrastructure/mail/templates/invite.template';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class InviteService {
  constructor(private jwtService: JwtService,
    private readonly mailService: MailService) { }

  async sendInvite(emailId: string, tenantId: string, role?: UserRole) {
    // Generate token
    const payload = { email: process.env.EMAIL_TO, role: role, tenantId: tenantId };
    const inviterName = 'medshift';

    const inviteToken = this.jwtService.sign(payload);

    // Example expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    /**
     * TODO:
     * Save invite to database
     *
     * Example:
     * await this.inviteRepository.create({
     *   email,
     *   token: inviteToken,
     *   expiresAt,
     * });
     */

    // Create frontend invite link

    const emailTo = process.env.EMAIL_TO;

    if (!emailTo) {
      throw new Error('EMAIL_TO is not defined');
    }

    const inviteLink =
      `${process.env.FRONTEND_URL}?token=${inviteToken}`;

    // Send email
    return await this.mailService.sendEmail({
      to: emailTo,
      subject: 'You are invited',
      html: inviteTemplate(inviterName, inviteLink)
    });
  }
}