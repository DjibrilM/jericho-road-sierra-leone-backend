import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  mixin,
  Type,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/util/constant';
import { Request } from 'express';

/**
 * Factory function to create a role-based guard
 * @param allowedRoles Array of roles allowed to access a route
 */
export function RoleCheckGuard(allowedRoles: string[]): Type<CanActivate> {
  @Injectable()
  class RoleCheckGuardMixin implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const user: any = await this.extractUserFromToken(request);

      if (!allowedRoles.includes(user.role)) {
        throw new UnauthorizedException(
          `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        );
      }

      return true;
    }

    private async extractUserFromToken(request: Request): Promise<any> {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];

      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException('Missing or invalid token');
      }

      try {
        return await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
      } catch {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }

  return mixin(RoleCheckGuardMixin);
}
