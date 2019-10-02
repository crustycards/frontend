import {Body, Controller, Delete, Get, Param, Put, Query, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Cardpack} from '../cardpack/interfaces/cardpack.interface';
import {CardpackService} from './cardpack.service';
import {BlackCard} from './interfaces/blackCard.interface';
import {JsonBlackCard} from './interfaces/jsonBlackCard.interface';
import {JsonWhiteCard} from './interfaces/jsonWhiteCard.interface';
import {WhiteCard} from './interfaces/whiteCard.interface';

@Controller('api')
export class CardpackController {
  constructor(private readonly cardpackService: CardpackService) {}

  @UseGuards(AuthGuard('cookie'))
  @Put('cardpacks/:userId')
  public createCardpack(@Param('userId') userId: string, @Body('name') name: string): Promise<Cardpack> {
    return this.cardpackService.createCardpack(userId, name);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('cardpack/:cardpackId')
  public getCardpackById(@Param('cardpackId') cardpackId: string): Promise<Cardpack> {
    return this.cardpackService.getCardpackById(cardpackId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('cardpacks/:userId')
  public getCardpacksByUser(@Param('userId') userId: string): Promise<Cardpack[]> {
    return this.cardpackService.getCardpacksByUser(userId);
  }

  // TODO - Enable this route and pipe it through to the client
  // @UseGuards(AuthGuard('cookie'))
  // @Patch('')
  // patchCardpack(): Promise<void> {
  //   return this.cardpackService.patchCardpack();
  // }

  @UseGuards(AuthGuard('cookie'))
  @Delete('cardpack/:cardpackId')
  public deleteCardpack(@Param('cardpackId') cardpackId: string): Promise<void> {
    return this.cardpackService.deleteCardpack(cardpackId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('cardpack/cards/white/:cardpackId')
  public createWhiteCards(
    @Param('cardpackId') cardpackId: string,
    @Body() cards: JsonWhiteCard[]
  ): Promise<WhiteCard[]> {
    return this.cardpackService.createWhiteCards(cardpackId, cards);
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('cardpack/cards/black/:cardpackId')
  public createBlackCards(
    @Param('cardpackId') cardpackId: string,
    @Body() cards: JsonBlackCard[]
  ): Promise<BlackCard[]> {
    return this.cardpackService.createBlackCards(cardpackId, cards);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('/cards/white/:cardId')
  public deleteWhiteCard(@Query('cardpackId') cardpackId: string, @Param('cardId') cardId: string): Promise<void> {
    return this.cardpackService.deleteWhiteCard(cardpackId, cardId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('/cards/black/:cardId')
  public deleteBlackCard(@Query('cardpackId') cardpackId: string, @Param('cardId') cardId: string): Promise<void> {
    return this.cardpackService.deleteBlackCard(cardpackId, cardId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Put('cardpacks/favorite/:userId')
  public favoriteCardpack(@Query('cardpackId') cardpackId: string, @Param('userId') userId: string): Promise<void> {
    return this.cardpackService.favoriteCardpack(userId, cardpackId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Delete('cardpacks/favorite/:userId')
  public unfavoriteCardpack(@Query('cardpackId') cardpackId: string, @Param('userId') userId: string): Promise<void> {
    return this.cardpackService.unfavoriteCardpack(userId, cardpackId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('cardpacks/favorite/:userId')
  public getFavoritedCardpacks(@Param('userId') userId: string): Promise<Cardpack[]> {
    return this.cardpackService.getFavoritedCardpacks(userId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('cardpacks/:userId/favorited')
  public checkIfCardpackIsFavorited(
    @Param('userId') userId: string,
    @Query('cardpackId') cardpackId: string
  ): Promise<boolean> {
    return this.cardpackService.checkIfCardpackIsFavorited(userId, cardpackId);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('search/cardpack')
  public searchCardpacks(@Query('query') query: string): Promise<Cardpack[]> {
    return this.cardpackService.searchCardpacks(query);
  }

  @UseGuards(AuthGuard('cookie'))
  @Get('search/cardpack/autocomplete')
  public searchCardpacksAutocomplete(@Query('query') query: string): Promise<string[]> {
    return this.cardpackService.searchCardpacksAutocomplete(query);
  }
}
