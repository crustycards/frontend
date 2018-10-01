import {BlackCard, Cardpack, JsonBlackCard, JsonWhiteCard, User, WhiteCard} from '../dao';

interface MainApi {
  getUser(id: string): Promise<User>;
  deleteWhiteCard(cardId: string): Promise<void>;
  deleteBlackCard(cardId: string): Promise<void>;
  deleteCardpack(cardpackId: string): Promise<void>;
  createCardpack(name: string): Promise<Cardpack>;
  getCardpack(id: string): Promise<Cardpack>;
  getCardpacksByUser(userId?: string): Promise<Cardpack[]>;
  createWhiteCards(cardpackId: string, cards: JsonWhiteCard[]): Promise<WhiteCard[]>;
  createBlackCards(cardpackId: string, cards: JsonBlackCard[]): Promise<BlackCard[]>;
  addFriend(friendId: string): Promise<void>;
  removeFriend(friendId: string): Promise<void>;
  searchUsers(query: string): Promise<User[]>;
  autocompleteUserSearch(query: string): Promise<string[]>;
  searchCardpacks(query: string): Promise<Cardpack[]>;
  autocompleteCardpackSearch(query: string): Promise<string[]>;
  favoriteCardpack(cardpackId: string): Promise<void>;
  unfavoriteCardpack(cardpackId: string): Promise<void>;
  getFavoritedCardpacks(userId?: string): Promise<Cardpack[]>;
  cardpackIsFavorited(cardpackId: string): Promise<boolean>;
  getProfileImageUrl(userId?: string): string;
  setProfileImage(data: Blob): Promise<void>;
}

export default MainApi;
