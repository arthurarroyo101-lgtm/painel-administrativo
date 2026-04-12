import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email'],
      passReqToCallback: false, // garante compatibilidade com os tipos
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return { id: profile.id, email: profile.emails?.[0]?.value };
  }
}