import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MicrosoftAuthService {
  constructor(private readonly jwtService: JwtService) {}

  verifyIdToken(idToken: string): {
    aud: string;
    name: string;
    email: string;
  } {
    const result = this.jwtService.decode(idToken, { complete: true });

    if (!result) throw new UnauthorizedException('Invalid microsoft Id Token!');
    const { payload } = result;

    return {
      aud: payload.aud,
      name: payload.name,
      email: payload.preferred_username,
    };
  }
}
