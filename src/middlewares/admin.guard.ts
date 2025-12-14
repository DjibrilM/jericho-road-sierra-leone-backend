import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/util/constant';

import { Request } from 'express';

@Injectable()
export class AdminCheck implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: any = await this.ExtractUserFromToken(request);

    if (user.role !== 'admin' && user.role !== 'comptable') {
      throw new UnauthorizedException('action required admin privilleges');
    }
    return true;
  }

  private async ExtractUserFromToken(
    request: Request,
  ): Promise<string | undefined> {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    let user: any;

    try {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        user = payload;
      } catch {
        throw new UnauthorizedException();
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate your role');
    }

    return user;
  }
}
