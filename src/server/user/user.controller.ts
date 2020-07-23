import {Body, Controller, Post, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Response} from 'express';
import {
  GetUserRequest,
  GetUserSettingsRequest,
  UpdateUserRequest,
  UpdateUserSettingsRequest
} from '../../../proto-gen-out/api/user_service_pb';
import {handleRequest} from '../rpc';
import {UserService} from './user.service';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('cookie'))
  @Post('UserService/GetUser')
  public async getUser(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      GetUserRequest.deserializeBinary,
      this.userService.client.getUser,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('UserService/UpdateUser')
  public async updateUser(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UpdateUserRequest.deserializeBinary,
      this.userService.client.updateUser,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('UserService/GetUserSettings')
  public async getUserSettings(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      GetUserSettingsRequest.deserializeBinary,
      this.userService.client.getUserSettings,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('UserService/UpdateUserSettings')
  public async updateUserSettings(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UpdateUserSettingsRequest.deserializeBinary,
      this.userService.client.updateUserSettings,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }
}
