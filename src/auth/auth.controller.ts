import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get()
  getHello() {
    return 'Auth funcionando!';
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const token = 'jwt-gerado-aqui';
    return res.redirect(`http://localhost:5173?token=${token}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const token = 'jwt-gerado-aqui';
    return res.redirect(`http://localhost:5173?token=${token}`);
  }
}