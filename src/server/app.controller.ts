import {Controller, Get, Req, Res, UseGuards, HttpStatus} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Request, Response} from 'express';
import * as fs from 'fs';

@Controller()
export class AppController {
  private favicon = fs.readFileSync(`${__dirname}/../client/dist/favicon.ico`);

  @UseGuards(AuthGuard('cookie'))
  @Get('logout')
  public async logout(@Req() req: Request, @Res() res: Response):
  Promise<void> {
    res.clearCookie('authToken').redirect('/login');
  }


  @Get('favicon.ico')
  public async getFavicon(@Res() res: Response): Promise<void> {
    res.setHeader('content-type', 'image/x-icon');
    res.status(HttpStatus.OK).send(this.favicon);
  }

  @Get('healthz')
  public async getHealthz(@Res() res: Response): Promise<void> {
    res.setHeader('content-type', 'text/html');
    res.status(HttpStatus.OK).send('<html><body><h1>200 OK</h1>Service ready.</body></html>');
  }
}
