import axios from 'axios';
import Api from './apiInterface';
import {User, Cardpack, WhiteCard, JsonWhiteCard, BlackCard, JsonBlackCard} from './dao';

export default class HttpApi implements Api {
  private userId: string

  constructor(currentUserId: string) {
    this.userId = currentUserId;
  }

  getUser(id: string = this.userId) {
    return axios.get<User>(`/api/user/${id}`)
      .then((res) => res.data);
  }

  deleteWhiteCard(cardId: string) {
    return axios.delete(`/api/cards/white/${cardId}`)
      .then(() => {});
  }

  deleteBlackCard(cardId: string) {
    return axios.delete(`/api/cards/black/${cardId}`)
      .then(() => {});
  }

  deleteCardpack(cardpackId: string) {
    return axios.delete(`/api/cardpack/${cardpackId}`)
      .then(() => {});
  }

  createCardpack(name: string) {
    return axios.put<Cardpack>(`/api/cardpacks/${this.userId}`, {name})
      .then((res) => res.data);
  }

  getCardpack(id: string) {
    return axios.get<Cardpack>(`/api/cardpack/${id}`)
      .then((res) => res.data);
  }

  getCardpacksByUser(userId: string) {
    return axios.get<Array<Cardpack>>(`/api/cardpacks/${userId}`)
      .then((res) => res.data);
  }

  createWhiteCards(cardpackId: string, cards: Array<JsonWhiteCard>) {
    return axios.put<Array<WhiteCard>>(`/api/cardpack/cards/white/${cardpackId}`, cards)
      .then((res) => res.data);
  }

  createBlackCards(cardpackId: string, cards: Array<JsonBlackCard>) {
    return axios.put<Array<BlackCard>>(`/api/cardpack/cards/black/${cardpackId}`, cards)
      .then((res) => res.data);
  }

  addFriend(friendId: string) {
    return axios.put(`/api/user/friends?userId=${this.userId}&friendId=${friendId}`)
      .then(() => {});
  }

  removeFriend(friendId: string) {
    return axios.delete(`/api/user/friends?userId=${this.userId}&friendId=${friendId}`)
      .then(() => {});
  }

  searchUsers(query: string) {
    return axios.get<Array<User>>(`/api/user/search?query=${query}`)
      .then((res) => res.data);
  }

  autocompleteUserSearch(query: string) {
    return axios.get<Array<string>>(`/api/user/search/autocomplete?query=${query}`)
      .then((res) => res.data);
  }

  searchCardpacks(query: string) {
    return axios.get<Array<Cardpack>>(`/api/cardpack/search?query=${query}`)
      .then((res) => res.data);
  }

  autocompleteCardpackSearch(query: string) {
    return axios.get<Array<string>>(`/api/cardpack/search/autocomplete?query=${query}`)
      .then((res) => res.data);
  }

  linkSessionToFirebase(firebaseToken: string) {
    return axios.put(`/api/session?token=${firebaseToken}`)
      .then(() => {});
  }
}
