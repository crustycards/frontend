import {Controller, Get, Req, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import * as cookie from 'cookie';
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
  public async logout(@Req() request: Request, @Res() response: Response): Promise<void> {
    // This should be safe since the AuthGuard above will
    // filter out any requests that don't have a session cookie
    const sessionId = cookie.parse(request.headers.cookie).session;
    await this.authService.deleteSession(sessionId);
    response.clearCookie('session').redirect('/login');
  }

  @Get('favicon.ico')
  public async getFavicon(@Res() response: Response): Promise<any> {
    response.setHeader('Content-Type', 'image/x-icon');
    response.send(this.favicon);
  }

  @Get('firebase-messaging-sw.js')
  public async getFirebaseServiceWorker(@Req() request: Request, @Res() response: Response): Promise<void> {
    response.setHeader('Content-Type', 'application/javascript');
    response.send(this.serviceWorker);
  }
}
