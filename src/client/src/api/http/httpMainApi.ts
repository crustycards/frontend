import axios from 'axios';
import * as _ from 'underscore';
import {BlackCard, Cardpack, JsonBlackCard, JsonWhiteCard, User, WhiteCard} from '../dao';
import MainApi from '../model/mainApi';

export default class HttpMainApi implements MainApi {
  private userId: string;

  constructor(currentUserId: string) {
    this.userId = currentUserId;

    _.bindAll(this, ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
  }

  public getUser(id: string = this.userId) {
    return axios.get<User>(`/api/user/${id}`)
      .then((res) => res.data);
  }

  public deleteWhiteCard(cardpackId: string, cardId: string) {
    return axios.delete(`/api/cards/white/${cardId}?cardpackId=${cardpackId}`)
      .then(() => null);
  }

  public deleteBlackCard(cardpackId: string, cardId: string) {
    return axios.delete(`/api/cards/black/${cardId}?cardpackId=${cardpackId}`)
      .then(() => null);
  }

  public deleteCardpack(cardpackId: string) {
    return axios.delete(`/api/cardpack/${cardpackId}`)
      .then(() => null);
  }

  public createCardpack(name: string) {
    return axios.put<Cardpack>(`/api/cardpacks/${this.userId}`, {name})
      .then((res) => this.parseCardpack(res.data));
  }

  public getCardpack(id: string) {
    return axios.get<Cardpack>(`/api/cardpack/${id}`)
      .then((res) => this.parseCardpack(res.data));
  }

  public getCardpacksByUser(userId: string = this.userId) {
    return axios.get<Cardpack[]>(`/api/cardpacks/${userId}`)
      .then((res) => res.data.map(this.parseCardpack));
  }

  public createWhiteCards(cardpackId: string, cards: JsonWhiteCard[]) {
    return axios.put<WhiteCard[]>(`/api/cardpack/cards/white/${cardpackId}`, cards)
      .then((res) => res.data);
  }

  public createBlackCards(cardpackId: string, cards: JsonBlackCard[]) {
    return axios.put<BlackCard[]>(`/api/cardpack/cards/black/${cardpackId}`, cards)
      .then((res) => res.data);
  }

  public addFriend(friendId: string) {
    return axios.put(`/api/user/friends?userId=${this.userId}&friendId=${friendId}`)
      .then(() => null);
  }

  public removeFriend(friendId: string) {
    return axios.delete(`/api/user/friends?userId=${this.userId}&friendId=${friendId}`)
      .then(() => null);
  }

  public searchUsers(query: string) {
    return axios.get<User[]>(`/api/search/user?query=${query}`)
      .then((res) => res.data);
  }

  public autocompleteUserSearch(query: string) {
    return axios.get<string[]>(`/api/search/user/autocomplete?query=${query}`)
      .then((res) => res.data);
  }

  public searchCardpacks(query: string) {
    return axios.get<Cardpack[]>(`/api/search/cardpack?query=${query}`)
      .then((res) => res.data.map(this.parseCardpack));
  }

  public autocompleteCardpackSearch(query: string) {
    return axios.get<string[]>(`/api/search/cardpack/autocomplete?query=${query}`)
      .then((res) => res.data);
  }

  public async favoriteCardpack(cardpackId: string) {
    await axios.put(`/api/cardpacks/favorite/${this.userId}?cardpackId=${cardpackId}`);
  }

  public async unfavoriteCardpack(cardpackId: string) {
    await axios.delete(`/api/cardpacks/favorite/${this.userId}?cardpackId=${cardpackId}`);
  }

  public getFavoritedCardpacks(userId: string = this.userId) {
    return axios.get<Cardpack[]>(`/api/cardpacks/favorite/${userId}`)
      .then((res) => res.data.map(this.parseCardpack));
  }

  public async cardpackIsFavorited(cardpackId: string) {
    const res = await axios.get(`/api/cardpacks/${this.userId}/favorited?cardpackId=${cardpackId}`);
    return res.data;
  }

  public getProfileImageUrl(userId: string = this.userId) {
    return `/api/user/profileimage/${userId}`;
  }

  public async setProfileImage(data: Blob) {
    const headers = {'Content-Type': 'application/octet-stream'};
    await axios.put(`/api/user/profileimage/${this.userId}`, data, {headers});
  }

  public async setUsername(name: string) {
    await axios.patch(`/api/user/${this.userId}`, [{op: 'replace', path: '/name', value: name}]);
  }

  private parseCardpack(data: any): Cardpack {
    return {...data, createdAt: new Date(data.createdAt)};
  }
}
