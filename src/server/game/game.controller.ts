import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GameService} from './game.service';
import {GameData} from './interfaces/gameData.interface';
import {GameInfo} from './interfaces/gameInfo.interface';

@Controller('api')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard('cookie'))
  @Post('game/create/:userId')
  public createGame(
    @Body() createGameData: {
      gameName: string,
      maxPlayers: number,
      maxScore: number,
      handSize: number,
      cardpackIds: string[]
    },
    @Param('userId') userId: string
  ): Promise<GameData> {
    return this.gameService.createGame(
      userId,
      createGameData.gameName,
      createGameData.maxPlayers,
      createGameData.maxScore,
      createGameData.handSize,
      createGameData.cardpackIds
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('game/start/:userId')
  public startGame(@Param('userId') userId: string): Promise<GameData> {
    return this.gameService.startGame(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('game/stop/:userId')
  public stopGame(@Param('userId') userId: string): Promise<GameData> {
    return this.gameService.stopGame(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('game/join/:userId')
  public joinGame(@Param('userId') userId: string, @Query('gameName') gameName: string): Promise<GameData> {
    return this.gameService.joinGame(userId, gameName);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('game/players/leave/:userId')
  public leaveGame(@Param('userId') userId: string): Promise<void> {
    return this.gameService.leaveGame(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('game/artificialPlayers/add/:userId')
  public addArtificialPlayers(
    @Param('userId') userId: string,
    @Body() data: {artificialPlayerName: string, amount: number}
  ): Promise<GameData> {
    return this.gameService.addArtificialPlayers(userId, data);
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('game/artificialPlayers/remove/:userId')
  public removeArtificialPlayers(
    @Param('userId') userId: string,
    @Body() data: {artificialPlayerName: string, amount: number}
  ): Promise<GameData> {
    return this.gameService.removeArtificialPlayers(userId, data);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('game/:userId')
  public getGameState(@Param('userId') userId: string): Promise<GameData> {
    return this.gameService.getGameState(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('games')
  public getGameList(): Promise<GameInfo[]> {
    return this.gameService.getGameList();
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('game/play/:userId')
  public playCards(@Param('userId') userId: string, @Body() cardIds: string[]): Promise<void> {
    return this.gameService.playCards(userId, cardIds);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('game/play/:userId')
  public unPlayCards(@Param('userId') userId: string): Promise<void> {
    return this.gameService.unPlayCards(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('game/players/kick')
  public kickPlayer(
    @Query('kickerUserId') kickerUserId: string,
    @Query('kickeeUserId') kickeeUserId: string
  ): Promise<GameData> {
    return this.gameService.kickPlayer(kickerUserId, kickeeUserId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('game/players/ban')
  public banPlayer(
    @Query('bannerUserId') bannerUserId: string,
    @Query('banneeUserId') banneeUserId: string
  ): Promise<GameData> {
    return this.gameService.banPlayer(bannerUserId, banneeUserId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('game/players/unban')
  public unbanPlayer(
    @Query('unbannerUserId') unbannerUserId: string,
    @Query('unbanneeUserId') unbanneeUserId: string
  ): Promise<GameData> {
    return this.gameService.unbanPlayer(unbannerUserId, unbanneeUserId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('game/vote/:userId')
  public vote(@Param('userId') userId: string, @Query('cardId') cardId: string): Promise<void> {
    return this.gameService.vote(userId, cardId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('game/continue/:userId')
  public startNextRound(@Param('userId') userId: string): Promise<void> {
    return this.gameService.startNextRound(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('game/messages/:userId')
  public sendMessage(@Param('userId') userId: string, @Body('messageText') messageText: string): Promise<GameData> {
    return this.gameService.sendMessage(userId, messageText);
  }
}
