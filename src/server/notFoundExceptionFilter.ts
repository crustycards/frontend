import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException
} from '@nestjs/common';
import {Request, Response} from 'express';
import * as fs from 'fs';
import {
  User,
  UserSettings
} from '../../proto-gen-out/crusty_cards_api/model_pb';
import {serializePreloadedState} from '../client/src/helpers/proto';
import {AuthService} from './auth/auth.service';
import {UserService} from './user/user.service';

// This filter catches any 404 errors and instead returns the
// single-page-web-app html.

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private static html =
    fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
  private static bundle =
    fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();

  private static generateHtmlWithScript =
  (user?: User, userSettings?: UserSettings) => (
    `<script>
      window.__PRELOADED_STATE__ = '${serializePreloadedState({user, userSettings})}'
    </script>
    ${NotFoundExceptionFilter.html}`
  )

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  public async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (request.path.startsWith('/api')) {
      return response.status(404).send('Invalid api route');
    }

    if (request.path.endsWith('/bundle.js')) {
      return response.status(200)
                     .contentType('applicaton/javascript')
                     .send(NotFoundExceptionFilter.bundle);
    }

    let dataFetchPromises: Promise<any>[] = [];
    let user: User | undefined;
    let userSettings: UserSettings | undefined;

    if (request.headers.cookie) {
      fs.writeFileSync('test.txt', 'Found some cookies!\n');
      fs.appendFileSync('test.txt', request.headers.cookie);
      const authToken = request.cookies.authToken;
      console.log(authToken);
      if (authToken) {
        fs.appendFileSync('test.txt', `\nFound auth token: ${authToken}`);
        const userName = this.authService.decodeJwtToUserName(authToken);
        fs.appendFileSync('test.txt', `\nDecoded user name: ${userName}`);
        if (userName) {
          fs.appendFileSync('test.txt', '\nCreating promises!');
          dataFetchPromises = [
            this.userService.getUser(userName)
              .then((fetchedUser) => user = fetchedUser),
            this.userService.getUserSettings(`${userName}/settings`)
              .then((fetchedUserSettings) => userSettings = fetchedUserSettings)
          ];
        }
      }
    }

    try {
      await Promise.all(dataFetchPromises);
    } catch (err) {
      // Most likely, the user does not exist if this block
      // is hit, in which case the error should be ignored.

      // TODO - Refactor this to make sure to only ignore
      // the error if it's from the user not existing.
    }
    fs.appendFileSync('test.txt', '\nPromises are fulfilled!');
    fs.appendFileSync('test.txt', `\nUser: ${JSON.stringify(user)}`);
    fs.appendFileSync('test.txt', `\nUser Settings: ${JSON.stringify(userSettings)}`);

    return response.status(200)
                   .contentType('html')
                   .send(NotFoundExceptionFilter
                     .generateHtmlWithScript(user, userSettings));
  }
}
