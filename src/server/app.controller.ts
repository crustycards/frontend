import {Controller, Get, Req, Res, UseGuards} from '@nestjs/common';
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
  public async getFavicon(@Res() res: Response): Promise<any> {
    res.setHeader('Content-Type', 'image/x-icon');
    return this.favicon;
  }
}
