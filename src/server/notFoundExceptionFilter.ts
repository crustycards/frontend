import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  NotFoundException
} from '@nestjs/common';
import * as cookie from 'cookie';
import {Request, Response} from 'express';
import * as fs from 'fs';
import {User} from './user/interfaces/user.interface';
import {UserService} from './user/user.service';

// This filter catches any 404 errors and instead returns the single-page-web-app html

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private static html = fs.readFileSync(`${__dirname}/../client/dist/index.html`).toString();
  private static bundle = fs.readFileSync(`${__dirname}/../client/dist/bundle.js`).toString();

  private static generateHtmlWithScript = (user?: User) => (
    `<script>
      window.__PRELOADED_STATE__ = ${JSON.stringify({user})}
    </script>
    ${NotFoundExceptionFilter.html}`
  )

  constructor(private readonly userService: UserService) {}

  public async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (request.path.startsWith('/api')) {
      return response.status(404).send('Invalid api route');
    }

    if (request.path.endsWith('/bundle.js')) {
      return response.status(200).contentType('applicaton/javascript').send(NotFoundExceptionFilter.bundle);
    }

    let user: User;
    if (request.headers.cookie) {
      const sessionId = cookie.parse(request.headers.cookie).session;
      if (sessionId) {
        user = await this.userService.getBySessionId(sessionId);
      }
    }

    return response.status(200).contentType('html').send(NotFoundExceptionFilter.generateHtmlWithScript(user));
  }
}
