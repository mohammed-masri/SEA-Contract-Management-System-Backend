import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthorizedRequest } from 'src/common/global.dto';
import { JWTConfig } from 'src/config';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: AuthorizedRequest = context.switchToHttp().getRequest();

    const authorization = (request.headers as any).authorization;

    if (!authorization)
      throw new UnauthorizedException(
        'the token is not provided in the authorization request headers',
      );

    let token = authorization;
    if (authorization.startsWith('Bearer ')) token = authorization.substring(7);

    try {
      const payload = this.jwtService.verify(token, {
        secret: JWTConfig.JWT_SECRET,
      });

      request.context = { id: payload.id };

      return true;
    } catch (error: any) {
      throw new UnauthorizedException(
        `invalid or expired token (${error.message})`,
      );
      return false;
    }
  }
}
