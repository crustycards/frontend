import {Controller, Delete, Get, Put, Query, Req, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Request, Response} from 'express';
import {User} from '../user/interfaces/user.interface';
import {AuthService} from './auth.service';
import {Session} from './interfaces/session.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('auth/google')
  public async loginGoogleOAuth(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = (req.user as User).id;
      const session = await this.authService.createSession(userId);
      res.cookie('session', session.id).redirect('/');
    } catch (err) {
      res.status(400).send('Failed to authenticate');
    }
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('api/session')
  public getSessionById(@Query('sessionId') sessionId: string): Promise<Session> {
    return this.authService.getSessionById(sessionId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('api/sessions')
  public getSessionsByUserId(@Query('userId') userId: string): Promise<Session[]> {
    return this.authService.getSessionsByUserId(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('api/session')
  public deleteSession(@Query('sessionId') sessionId: string): Promise<void> {
    return this.authService.deleteSession(sessionId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('api/sessions')
  public deleteUserSessions(@Query('userId') userId: string): Promise<void> {
    return this.authService.deleteUserSessions(userId);
  }
}
