import {Body, Controller, Post, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Response} from 'express';
import {
  GetCardpackRequest,
  CreateCardpackRequest,
  ListCardpacksRequest,
  UpdateCardpackRequest,
  DeleteCardpackRequest,
  CreateBlackCardRequest,
  CreateWhiteCardRequest,
  ListBlackCardsRequest,
  ListWhiteCardsRequest,
  UpdateBlackCardRequest,
  UpdateWhiteCardRequest,
  DeleteBlackCardRequest,
  DeleteWhiteCardRequest,
  BatchCreateBlackCardsRequest,
  BatchCreateWhiteCardsRequest,
  BatchDeleteBlackCardsRequest,
  BatchDeleteWhiteCardsRequest,
  UndeleteCardpackRequest,
  UndeleteBlackCardRequest,
  UndeleteWhiteCardRequest,
  LikeCardpackRequest,
  UnlikeCardpackRequest,
  CheckDoesUserLikeCardpackRequest,
  CardpackSearchRequest,
  AutocompleteCardpackSearchRequest
} from '../../../proto-gen-out/api/cardpack_service_pb';
import {handleRequest} from '../rpc';
import {CardpackService} from './cardpack.service';

@Controller('api')
export class CardpackController {
  constructor(private readonly cardpackService: CardpackService) {}

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CreateCardpack')
  public async createCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CreateCardpackRequest.deserializeBinary,
      this.cardpackService.client.createCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/GetCardpack')
  public async getCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      GetCardpackRequest.deserializeBinary,
      this.cardpackService.client.getCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListCardpacks')
  public async listCardpacks(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListCardpacksRequest.deserializeBinary,
      this.cardpackService.client.listCardpacks,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UpdateCardpack')
  public async updateCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UpdateCardpackRequest.deserializeBinary,
      this.cardpackService.client.updateCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/DeleteCardpack')
  public async deleteCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      DeleteCardpackRequest.deserializeBinary,
      this.cardpackService.client.deleteCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CreateBlackCard')
  public async createBlackCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CreateBlackCardRequest.deserializeBinary,
      this.cardpackService.client.createBlackCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CreateWhiteCard')
  public async createWhiteCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CreateWhiteCardRequest.deserializeBinary,
      this.cardpackService.client.createWhiteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListBlackCards')
  public async listBlackCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListBlackCardsRequest.deserializeBinary,
      this.cardpackService.client.listBlackCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListWhiteCards')
  public async listWhiteCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListWhiteCardsRequest.deserializeBinary,
      this.cardpackService.client.listWhiteCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UpdateBlackCard')
  public async updateBlackCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UpdateBlackCardRequest.deserializeBinary,
      this.cardpackService.client.updateBlackCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UpdateWhiteCard')
  public async updateWhiteCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UpdateWhiteCardRequest.deserializeBinary,
      this.cardpackService.client.updateWhiteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/DeleteBlackCard')
  public async deleteBlackCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      DeleteBlackCardRequest.deserializeBinary,
      this.cardpackService.client.deleteBlackCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/DeleteWhiteCard')
  public async deleteWhiteCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      DeleteWhiteCardRequest.deserializeBinary,
      this.cardpackService.client.deleteWhiteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/BatchCreateBlackCards')
  public async batchCreateBlackCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      BatchCreateBlackCardsRequest.deserializeBinary,
      this.cardpackService.client.batchCreateBlackCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/BatchCreateWhiteCards')
  public async batchCreateWhiteCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      BatchCreateWhiteCardsRequest.deserializeBinary,
      this.cardpackService.client.batchCreateWhiteCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/BatchDeleteBlackCards')
  public async batchDeleteBlackCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      BatchDeleteBlackCardsRequest.deserializeBinary,
      this.cardpackService.client.batchDeleteBlackCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/BatchDeleteWhiteCards')
  public async batchDeleteWhiteCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      BatchDeleteWhiteCardsRequest.deserializeBinary,
      this.cardpackService.client.batchDeleteWhiteCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UndeleteCardpack')
  public async undeleteCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UndeleteCardpackRequest.deserializeBinary,
      this.cardpackService.client.undeleteCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UndeleteBlackCard')
  public async undeleteBlackCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UndeleteBlackCardRequest.deserializeBinary,
      this.cardpackService.client.undeleteBlackCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UndeleteWhiteCard')
  public async undeleteWhiteCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UndeleteWhiteCardRequest.deserializeBinary,
      this.cardpackService.client.undeleteWhiteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/LikeCardpack')
  public async likeCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      LikeCardpackRequest.deserializeBinary,
      this.cardpackService.client.likeCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UnlikeCardpack')
  public async unlikeCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UnlikeCardpackRequest.deserializeBinary,
      this.cardpackService.client.unlikeCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CheckDoesUserLikeCardpack')
  public async checkDoesUserLikeCardpack(
    @Body() body: any,
    @Res() res: Response
  ) {
    handleRequest(
      body,
      res,
      CheckDoesUserLikeCardpackRequest.deserializeBinary,
      this.cardpackService.client.checkDoesUserLikeCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CardpackSearch')
  public async cardpackSearch(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CardpackSearchRequest.deserializeBinary,
      this.cardpackService.client.cardpackSearch,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/AutocompleteCardpackSearch')
  public async autocompleteCardpackSearch(
    @Body() body: any,
    @Res() res: Response
  ) {
    handleRequest(
      body,
      res,
      AutocompleteCardpackSearchRequest.deserializeBinary,
      this.cardpackService.client.autocompleteCardpackSearch,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }
}
