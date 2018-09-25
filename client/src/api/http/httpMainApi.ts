import axios from 'axios';
import MainApi from '../model/mainApi';
import {User, Cardpack, WhiteCard, JsonWhiteCard, BlackCard, JsonBlackCard} from '../dao';
import * as _ from 'underscore';

export default class HttpMainApi implements MainApi {
  private userId: string

  constructor(currentUserId: string) {
    this.userId = currentUserId;

    _.bindAll(this, ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
  }

  private parseCardpack(data: any): Cardpack {
    return {...data, createdAt: new Date(data.createdAt)};
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
      .then((res) => this.parseCardpack(res.data));
  }

  getCardpack(id: string) {
    return axios.get<Cardpack>(`/api/cardpack/${id}`)
      .then((res) => this.parseCardpack(res.data));
  }

  getCardpacksByUser(userId: string = this.userId) {
    return axios.get<Array<Cardpack>>(`/api/cardpacks/${userId}`)
      .then((res) => res.data.map(this.parseCardpack));
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
      .then((res) => res.data.map(this.parseCardpack));
  }

  autocompleteCardpackSearch(query: string) {
    return axios.get<Array<string>>(`/api/cardpack/search/autocomplete?query=${query}`)
      .then((res) => res.data);
  }

  async favoriteCardpack(cardpackId: string) {
    await axios.put(`/api/cardpacks/favorite/${this.userId}?cardpackId=${cardpackId}`);
  }

  async unfavoriteCardpack(cardpackId: string) {
    await axios.delete(`/api/cardpacks/favorite/${this.userId}?cardpackId=${cardpackId}`);
  }

  getFavoritedCardpacks(userId: string = this.userId) {
    return axios.get<Array<Cardpack>>(`/api/cardpacks/favorite/${userId}`)
      .then((res) => res.data.map(this.parseCardpack));
  }

  async cardpackIsFavorited(cardpackId: string) {
    const res = await axios.get(`/api/cardpacks/favorited?userId=${this.userId}&cardpackId=${cardpackId}`);
    return res.data;
  }

  getProfileImageUrl(userId: string = this.userId) {
    return `/api/user/profileimage/${userId}`;
  }

  async setProfileImage(data: Blob) {
    const headers = {'Content-Type': 'application/octet-stream'};
    await axios.put(`/api/user/profileimage/${this.userId}`, data, {headers});
  }
}
