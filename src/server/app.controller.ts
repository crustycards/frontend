import {Controller, Get, Req, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Request, Response} from 'express';
import * as fs from 'fs';
import * as typescript from 'typescript';
import {AuthService} from './auth/auth.service';

@Controller()
export class AppController {
  private favicon = fs.readFileSync(`${__dirname}/../client/dist/favicon.ico`);

  private serviceWorker = typescript.transpile(fs.readFileSync(
    `${__dirname}/../client/src/serviceWorker/serviceWorker.ts`
  ).toString());

  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('cookie'))
  @Get('logout')
  public async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    // This should be safe since the AuthGuard above will
    // filter out any requests that don't have a session cookie
    const sessionId = req.cookies.session;
    await this.authService.deleteSession(sessionId);
    res.clearCookie('session').redirect('/login');
  }

  @Get('favicon.ico')
  public async getFavicon(@Res() res: Response): Promise<any> {
    res.setHeader('Content-Type', 'image/x-icon');
    res.send(this.favicon);
  }

  @Get('firebase-messaging-sw.js')
  public async getFirebaseServiceWorker(@Res() res: Response): Promise<void> {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(this.serviceWorker);
  }
}
