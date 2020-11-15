import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {
  SearchGamesRequest,
  CreateGameRequest,
  StartGameRequest,
  StopGameRequest,
  JoinGameRequest,
  LeaveGameRequest,
  KickUserRequest,
  BanUserRequest,
  UnbanUserRequest,
  PlayCardsRequest,
  UnplayCardsRequest,
  VoteCardRequest,
  VoteStartNextRoundRequest,
  AddArtificialPlayerRequest,
  RemoveArtificialPlayerRequest,
  CreateChatMessageRequest,
  GetGameViewRequest
} from '../../../proto-gen-out/api/game_service_pb';
import {GameService} from './game.service';
import {handleRequest} from '../rpc';
import {Response} from 'express';

@Controller('api')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/SearchGames')
  public async searchGames(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      SearchGamesRequest.deserializeBinary,
      this.gameService.client.searchGames,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/CreateGame')
  public async createGame(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CreateGameRequest.deserializeBinary,
      this.gameService.client.createGame,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/StartGame')
  public async startGame(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      StartGameRequest.deserializeBinary,
      this.gameService.client.startGame,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/StopGame')
  public async stopGame(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      StopGameRequest.deserializeBinary,
      this.gameService.client.stopGame,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/JoinGame')
  public async joinGame(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      JoinGameRequest.deserializeBinary,
      this.gameService.client.joinGame,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/LeaveGame')
  public async leaveGame(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      LeaveGameRequest.deserializeBinary,
      this.gameService.client.leaveGame,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/KickUser')
  public async kickUser(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      KickUserRequest.deserializeBinary,
      this.gameService.client.kickUser,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/BanUser')
  public async banUser(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      BanUserRequest.deserializeBinary,
      this.gameService.client.banUser,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/UnbanUser')
  public async unbanUser(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UnbanUserRequest.deserializeBinary,
      this.gameService.client.unbanUser,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/PlayCards')
  public async playCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      PlayCardsRequest.deserializeBinary,
      this.gameService.client.playCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/UnplayCards')
  public async unplayCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UnplayCardsRequest.deserializeBinary,
      this.gameService.client.unplayCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/VoteCard')
  public async voteCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      VoteCardRequest.deserializeBinary,
      this.gameService.client.voteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/VoteStartNextRound')
  public async voteStartNextRound(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      VoteStartNextRoundRequest.deserializeBinary,
      this.gameService.client.voteStartNextRound,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/AddArtificialPlayer')
  public async addArtificialPlayer(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      AddArtificialPlayerRequest.deserializeBinary,
      this.gameService.client.addArtificialPlayer,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/RemoveArtificialPlayer')
  public async removeArtificialPlayer(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      RemoveArtificialPlayerRequest.deserializeBinary,
      this.gameService.client.removeArtificialPlayer,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/CreateChatMessage')
  public async createChatMessage(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CreateChatMessageRequest.deserializeBinary,
      this.gameService.client.createChatMessage,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('GameService/GetGameView')
  public async getGameView(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      GetGameViewRequest.deserializeBinary,
      this.gameService.client.getGameView,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }
}
