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
    if (maxPlayers < 4 || maxPlayers > 20) {
      const message = 'Max players must be between 4 and 20';
      return Promise.reject(message);
    }
    if (maxScore < 4 || maxScore > 20) {
      const message = 'Max score must be between 4 and 20';
      return Promise.reject(message);
    }
    if (!gameName) {
      const message = 'Game name cannot be blank';
      return Promise.reject(message);
    }
    if (!cardpackIds.length) {
      const message = 'Must select at least one cardpack';
      return Promise.reject(message);
    }
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
    return axios.delete(`/api/game/players/${this.userId}`)
      .then((response) => {
        return response.data;
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
      });
  }

  public playCards(cardIds: string[]) {
    return axios.put(`/api/game/play/${this.userId}`, cardIds).then(() => null);
  }

  public unPlayCards() {
    return axios.delete(`/api/game/play/${this.userId}`).then(() => null);
  }

  public kickPlayer(playerId: string) {
    return axios.delete(`/api/game/players?${queryString.stringify({
      kickerId: this.userId,
      kickeeId: playerId
    })}`).then(() => null);
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
      message,
      {headers: {'Content-Type': 'text/plain'}}
    )
      .then((response) => {
        return response.data;
      });
  }
}
