import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        this.configService.get<string>('app.jwtSecret') as string,
      ) as JwtPayload;

      if (!decoded.tenantId) {
        throw new UnauthorizedException('Tenant ID missing in token');
      }

      req.user = decoded as unknown as User;
      req.tenantId = decoded.tenantId;

      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
