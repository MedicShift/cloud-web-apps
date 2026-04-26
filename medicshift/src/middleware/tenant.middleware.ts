import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TenantMiddleware implements NestMiddleware {

  constructor(
    private configService: ConfigService,
  ) { }
  
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded: any = jwt.verify(token, this.configService.get<string>('app.jwtSecret') as string,);

      if (!decoded.tenantId) {
        throw new UnauthorizedException('Tenant ID missing in token');
      }

      req.user = decoded; // optional
      req.tenantId = decoded.tenantId;

      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}