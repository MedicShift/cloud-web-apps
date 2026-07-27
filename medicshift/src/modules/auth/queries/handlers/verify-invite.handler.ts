import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VerifyInviteQuery } from '../impl/verify-invite.query';
import { InviteRepository } from '../../../invite/repositories/invite.repository';
import { JwtPayload } from '../../../../common/interfaces/jwt-payload.interface';

@QueryHandler(VerifyInviteQuery)
export class VerifyInviteHandler implements IQueryHandler<VerifyInviteQuery> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly inviteRepository: InviteRepository,
  ) {}

  async execute(query: VerifyInviteQuery) {
    try {
      const payload: JwtPayload = this.jwtService.verify(query.token);

      const invite = await this.inviteRepository.findPendingByEmail(
        payload.email,
      );

      if (!invite || invite.expiresAt < new Date()) {
        throw new UnauthorizedException('Invite is invalid or expired');
      }

      return {
        email: payload.email,
        role: payload.role,
        tenantId: payload.tenantId,
        departmentId: payload.departmentId,
      };
    } catch {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }
}
