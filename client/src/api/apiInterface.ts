import {User, Cardpack, WhiteCard, JsonWhiteCard, BlackCard, JsonBlackCard} from './dao';

interface ApiInterface {
  getUser(id: string): Promise<User>
  deleteWhiteCard(cardId: string): Promise<void>
  deleteBlackCard(cardId: string): Promise<void>
  deleteCardpack(cardpackId: string): Promise<void>
  createCardpack(name: string): Promise<Cardpack>
  getCardpack(id: string): Promise<Cardpack>
  getCardpacksByUser(userId: string): Promise<Array<Cardpack>>
  createWhiteCards(cardpackId: string, cards: Array<JsonWhiteCard>): Promise<Array<WhiteCard>>
  createBlackCards(cardpackId: string, cards: Array<JsonBlackCard>): Promise<Array<BlackCard>>
  addFriend(friendId: string): Promise<void>
  removeFriend(friendId: string): Promise<void>
  searchUsers(query: string): Promise<Array<User>>
  autocompleteUserSearch(query: string): Promise<Array<String>>
  searchCardpacks(query: string): Promise<Array<Cardpack>>
  autocompleteCardpackSearch(query: string): Promise<Array<String>>
  linkSessionToFirebase(firebaseToken: string): Promise<void>
}

export default ApiInterface;
