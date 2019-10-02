import {Body, Controller, Delete, Get, Param, Patch, Put, Query, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Response} from 'express';
import {User} from './interfaces/user.interface';
import {UserService} from './user.service';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('cookie'))
  @Get('user/:userId')
  public getUserById(@Param('userId') userId: string): Promise<User> {
    return this.userService.getById(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Patch('user/:userId')
  public patchUser(@Param('userId') userId: string, @Body() data: any[]) {
    return this.userService.patchUser(userId, data);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('user/profileimage/:userId')
  public async getUserProfileImage(@Res() response: Response, @Param('userId') userId: string) {
    response.type('png');
    response.send(await this.userService.getUserProfileImage(userId));
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('user/profileimage/:userId')
  public setUserProfileImage(@Param('userId') userId: string, @Body() data: Buffer): Promise<void> {
    return this.userService.setUserProfileImage(userId, data.buffer);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('search/user')
  public searchUsers(@Query('query') query: string): Promise<User[]> {
    return this.userService.searchUsers(query);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('search/user/autocomplete')
  public searchUsersAutocomplete(@Query('query') query: string): Promise<string[]> {
    return this.userService.searchUsersAutocomplete(query);
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('user/friends')
  public addFriend(@Query('userId') userId: string, @Query('friendId') friendId: string) {
    return this.userService.addFriend(userId, friendId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('user/friends')
  public removeFriend(@Query('userId') userId: string, @Query('friendId') friendId: string) {
    return this.userService.removeFriend(userId, friendId);
  }
}
