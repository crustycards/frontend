import {User, Cardpack, WhiteCard, JsonWhiteCard, BlackCard, JsonBlackCard} from '../dao';

interface MainApi {
  getUser(id: string): Promise<User>
  deleteWhiteCard(cardId: string): Promise<void>
  deleteBlackCard(cardId: string): Promise<void>
  deleteCardpack(cardpackId: string): Promise<void>
  createCardpack(name: string): Promise<Cardpack>
  getCardpack(id: string): Promise<Cardpack>
  getCardpacksByUser(userId?: string): Promise<Array<Cardpack>>
  createWhiteCards(cardpackId: string, cards: Array<JsonWhiteCard>): Promise<Array<WhiteCard>>
  createBlackCards(cardpackId: string, cards: Array<JsonBlackCard>): Promise<Array<BlackCard>>
  addFriend(friendId: string): Promise<void>
  removeFriend(friendId: string): Promise<void>
  searchUsers(query: string): Promise<Array<User>>
  autocompleteUserSearch(query: string): Promise<Array<string>>
  searchCardpacks(query: string): Promise<Array<Cardpack>>
  autocompleteCardpackSearch(query: string): Promise<Array<string>>
  favoriteCardpack(cardpackId: string): Promise<void>
  unfavoriteCardpack(cardpackId: string): Promise<void>
  getFavoritedCardpacks(userId?: string): Promise<Array<Cardpack>>
  cardpackIsFavorited(cardpackId: string): Promise<boolean>
  getProfileImageUrl(userId?: string): string
  setProfileImage(data: Blob): Promise<void>
}

export default MainApi;
