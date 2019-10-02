import axios from 'axios';
import * as queryString from 'query-string';
import * as _ from 'underscore';
import GameApi from '../model/gameApi';

export default class HttpGameApi implements GameApi {
  private userId: string;

  constructor(currentUserId: string) {
    this.userId = currentUserId;

    _.bindAll(this, ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
  }

  public createGame(
    gameName: string,
    maxPlayers: number,
    maxScore: number,
    handSize: number,
    cardpackIds: string[]
  ) {
    return axios.post(
      `/api/game/create/${this.userId}`,
      {
        gameName,
        maxPlayers,
        maxScore,
        handSize,
        cardpackIds
      }
    )
      .then((response) => {
        return response.data;
      });
  }

  public startGame() {
    return axios.post(`/api/game/start/${this.userId}`)
      .then((response) => {
        return response.data;
      });
  }

  public stopGame() {
    return axios.post(`/api/game/stop/${this.userId}`)
      .then((response) => {
        return response.data;
      });
  }

  public joinGame(gameName: string) {
    return axios.post(`/api/game/join/${this.userId}?${queryString.stringify({gameName})}`)
      .then((response) => {
        return response.data;
      });
  }

  public leaveGame() {
    return axios.delete(`/api/game/players/leave/${this.userId}`)
      .then((response) => {
        return response.data;
      });
  }

  public addArtificialPlayer(artificialPlayerName: string) {
    return axios.post(`/api/game/artificialPlayers/add/${this.userId}`, {artificialPlayerName})
      .then((response) => {
        return response.data || null;
      });
  }

  public removeArtificialPlayer(artificialPlayerName: string) {
    return axios.post(`/api/game/artificialPlayers/remove/${this.userId}`, {artificialPlayerName})
      .then((response) => {
        return response.data || null;
      });
  }

  public addArtificialPlayers(amount: number) {
    return axios.post(`/api/game/artificialPlayers/add/${this.userId}`, {amount})
      .then((response) => {
        return response.data || null;
      });
  }

  public removeArtificialPlayers(amount: number) {
    return axios.post(`/api/game/artificialPlayers/remove/${this.userId}`, {amount})
      .then((response) => {
        return response.data || null;
      });
  }

  public getGameState() {
    return axios.get(`/api/game/${this.userId}`)
      .then((response) => {
        return response.data || null;
      });
  }

  public getGameList() {
    return axios.get('/api/games')
      .then((response) => {
        return response.data;
      })
      .then((gameInfoList) => (
        gameInfoList.map((gameInfo: any) => ({...gameInfo, lastActivity: new Date(gameInfo.lastActivity)}))
      ));
  }

  public playCards(cardIds: string[]) {
    return axios.put(`/api/game/play/${this.userId}`, cardIds).then(() => null);
  }

  public unPlayCards() {
    return axios.delete(`/api/game/play/${this.userId}`).then(() => null);
  }

  public kickPlayer(playerId: string) {
    return axios.delete(`/api/game/players/kick?${queryString.stringify({
      kickerUserId: this.userId,
      kickeeUserId: playerId
    })}`)
      .then((response) => {
        return response.data;
      });
  }

  public banPlayer(playerId: string) {
    return axios.delete(`/api/game/players/ban?${queryString.stringify({
      bannerUserId: this.userId,
      banneeUserId: playerId
    })}`)
      .then((response) => {
        return response.data;
      });
  }

  public unbanPlayer(playerId: string) {
    return axios.put(`/api/game/players/unban?${queryString.stringify({
      unbannerUserId: this.userId,
      unbanneeUserId: playerId
    })}`)
      .then((response) => {
        return response.data;
      });
  }

  public vote(cardId: string) {
    return axios.put(`/api/game/vote/${this.userId}?${queryString.stringify({cardId})}`).then(() => null);
  }

  public startNextRound() {
    return axios.put(`/api/game/continue/${this.userId}`).then(() => null);
  }

  public sendMessage(message: string) {
    return axios.put(
      `/api/game/messages/${this.userId}`,
      {messageText: message}
    )
      .then((response) => {
        return response.data;
      });
  }
}
