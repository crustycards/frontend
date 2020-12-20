import {Body, Controller, Post, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Response} from 'express';
import {
  GetCustomCardpackRequest,
  CreateCustomCardpackRequest,
  ListCustomCardpacksRequest,
  UpdateCustomCardpackRequest,
  DeleteCustomCardpackRequest,
  CreateCustomBlackCardRequest,
  CreateCustomWhiteCardRequest,
  ListCustomBlackCardsRequest,
  ListCustomWhiteCardsRequest,
  UpdateCustomBlackCardRequest,
  UpdateCustomWhiteCardRequest,
  DeleteCustomBlackCardRequest,
  DeleteCustomWhiteCardRequest,
  BatchCreateCustomBlackCardsRequest,
  BatchCreateCustomWhiteCardsRequest,
  ListFavoritedCustomCardpacksRequest,
  UndeleteCustomCardpackRequest,
  UndeleteCustomBlackCardRequest,
  UndeleteCustomWhiteCardRequest,
  LikeCustomCardpackRequest,
  UnlikeCustomCardpackRequest,
  CheckDoesUserLikeCustomCardpackRequest,
  GetDefaultCardpackRequest,
  ListDefaultCardpacksRequest,
  ListDefaultBlackCardsRequest,
  ListDefaultWhiteCardsRequest
} from '../../../proto-gen-out/api/cardpack_service_pb';
import {handleRequest} from '../rpc';
import {CardpackService} from './cardpack.service';

@Controller('api')
export class CardpackController {
  constructor(private readonly cardpackService: CardpackService) {}

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CreateCustomCardpack')
  public async createCustomCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CreateCustomCardpackRequest.deserializeBinary,
      this.cardpackService.client.createCustomCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/GetCustomCardpack')
  public async getCustomCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      GetCustomCardpackRequest.deserializeBinary,
      this.cardpackService.client.getCustomCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListCustomCardpacks')
  public async listCustomCardpacks(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListCustomCardpacksRequest.deserializeBinary,
      this.cardpackService.client.listCustomCardpacks,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UpdateCustomCardpack')
  public async updateCustomCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UpdateCustomCardpackRequest.deserializeBinary,
      this.cardpackService.client.updateCustomCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/DeleteCustomCardpack')
  public async deleteCustomCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      DeleteCustomCardpackRequest.deserializeBinary,
      this.cardpackService.client.deleteCustomCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CreateCustomBlackCard')
  public async createCustomBlackCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CreateCustomBlackCardRequest.deserializeBinary,
      this.cardpackService.client.createCustomBlackCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CreateCustomWhiteCard')
  public async createCustomWhiteCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      CreateCustomWhiteCardRequest.deserializeBinary,
      this.cardpackService.client.createCustomWhiteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListCustomBlackCards')
  public async listCustomBlackCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListCustomBlackCardsRequest.deserializeBinary,
      this.cardpackService.client.listCustomBlackCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListCustomWhiteCards')
  public async listCustomWhiteCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListCustomWhiteCardsRequest.deserializeBinary,
      this.cardpackService.client.listCustomWhiteCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UpdateCustomBlackCard')
  public async updateCustomBlackCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UpdateCustomBlackCardRequest.deserializeBinary,
      this.cardpackService.client.updateCustomBlackCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UpdateCustomWhiteCard')
  public async updateCustomWhiteCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UpdateCustomWhiteCardRequest.deserializeBinary,
      this.cardpackService.client.updateCustomWhiteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/DeleteCustomBlackCard')
  public async deleteCustomBlackCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      DeleteCustomBlackCardRequest.deserializeBinary,
      this.cardpackService.client.deleteCustomBlackCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/DeleteCustomWhiteCard')
  public async deleteCustomWhiteCard(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      DeleteCustomWhiteCardRequest.deserializeBinary,
      this.cardpackService.client.deleteCustomWhiteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/BatchCreateCustomBlackCards')
  public async batchCreateCustomBlackCards
  (@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      BatchCreateCustomBlackCardsRequest.deserializeBinary,
      this.cardpackService.client.batchCreateCustomBlackCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/BatchCreateCustomWhiteCards')
  public async batchCreateCustomWhiteCards
  (@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      BatchCreateCustomWhiteCardsRequest.deserializeBinary,
      this.cardpackService.client.batchCreateCustomWhiteCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/GetDefaultCardpack')
  public async getDefaultCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      GetDefaultCardpackRequest.deserializeBinary,
      this.cardpackService.client.getDefaultCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListDefaultCardpacks')
  public async listDefaultCardpacks(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListDefaultCardpacksRequest.deserializeBinary,
      this.cardpackService.client.listDefaultCardpacks,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListDefaultBlackCards')
  public async listDefaultBlackCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListDefaultBlackCardsRequest.deserializeBinary,
      this.cardpackService.client.listDefaultBlackCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListDefaultWhiteCards')
  public async listDefaultWhiteCards(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListDefaultWhiteCardsRequest.deserializeBinary,
      this.cardpackService.client.listDefaultWhiteCards,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UndeleteCustomCardpack')
  public async undeleteCustomCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UndeleteCustomCardpackRequest.deserializeBinary,
      this.cardpackService.client.undeleteCustomCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UndeleteCustomBlackCard')
  public async undeleteCustomBlackCard
  (@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UndeleteCustomBlackCardRequest.deserializeBinary,
      this.cardpackService.client.undeleteCustomBlackCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UndeleteCustomWhiteCard')
  public async undeleteCustomWhiteCard
  (@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UndeleteCustomWhiteCardRequest.deserializeBinary,
      this.cardpackService.client.undeleteCustomWhiteCard,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/ListFavoritedCustomCardpacks')
  public async listFavoritedCustomCardpacks
  (@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      ListFavoritedCustomCardpacksRequest.deserializeBinary,
      this.cardpackService.client.listFavoritedCustomCardpacks,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/LikeCustomCardpack')
  public async likeCustomCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      LikeCustomCardpackRequest.deserializeBinary,
      this.cardpackService.client.likeCustomCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/UnlikeCustomCardpack')
  public async unlikeCustomCardpack(@Body() body: any, @Res() res: Response) {
    handleRequest(
      body,
      res,
      UnlikeCustomCardpackRequest.deserializeBinary,
      this.cardpackService.client.unlikeCustomCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }

  @UseGuards(AuthGuard('cookie'))
  @Post('CardpackService/CheckDoesUserLikeCustomCardpack')
  public async checkDoesUserLikeCustomCardpack(
    @Body() body: any,
    @Res() res: Response
  ) {
    handleRequest(
      body,
      res,
      CheckDoesUserLikeCustomCardpackRequest.deserializeBinary,
      this.cardpackService.client.checkDoesUserLikeCustomCardpack,
      (request) => {
        // TODO - Implement request validation.
        return request;
      }
    );
  }
}
