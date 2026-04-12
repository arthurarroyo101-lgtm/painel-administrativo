import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: any) {
    return this.jwtService.sign({
      sub: user.id || user.username || user.email,
      email: user.email,
    });
  }
}