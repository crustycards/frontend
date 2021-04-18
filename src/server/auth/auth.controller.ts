import {Controller, Get, Req, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Request, Response} from 'express';
import {User} from '../../../proto-gen-out/crusty_cards_api/model_pb';
import {UserService} from '../user/user.service';
import {AuthService} from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('auth/google')
  public async loginGoogleOAuth(@Req() req: Request, @Res() res: Response) {
    try {
      // TODO - The userName below might be the oauth id. I'm actually not sure
      // what it is. Need to investigate. If it is an oauth id, we need to
      // exchange it for the userName before creating the JWT.
      const userName = (req.user as User).getName();
      const authToken = this.authService.createJwtFromUserName(userName);
      res.cookie('authToken', authToken).redirect('/');
    } catch (err) {
      res.status(400).send('Failed to authenticate');
    }
  }
}
