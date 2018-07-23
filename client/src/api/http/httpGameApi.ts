import axios from 'axios';
import * as queryString from 'query-string';
import GameApi from '../model/gameApi';
import * as _ from 'underscore';

export default class HttpGameApi implements GameApi {
  private userId: string

  constructor(currentUserId: string) {
    this.userId = currentUserId;

    _.bindAll(this, ...Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
  }

  createGame(
    gameName: string,
    maxPlayers: number,
    maxScore: number,
    handSize: number,
    cardpackIds: Array<string>
  ) {
    if (maxPlayers < 4 || maxPlayers > 20) {
      let message = 'Max players must be between 4 and 20';
      return Promise.reject(message);
    }
    if (maxScore < 4 || maxScore > 20) {
      let message = 'Max score must be between 4 and 20';
      return Promise.reject(message);
    }
    if (!gameName) {
      let message = 'Game name cannot be blank';
      return Promise.reject(message);
    }
    if (!cardpackIds.length) {
      let message = 'Must select at least one cardpack';
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

  startGame() {
    return axios.post(`/api/game/start/${this.userId}`)
      .then((response) => {
        return response.data;
      });
  }

  stopGame() {
    return axios.post(`/api/game/stop/${this.userId}`)
      .then((response) => {
        return response.data;
      });
  }

  joinGame(gameName: string) {
    return axios.post(`/api/game/join/${this.userId}?${queryString.stringify({gameName})}`)
      .then((response) => {
        return response.data;
      });
  }

  leaveGame() {
    return axios.delete(`/api/game/players/${this.userId}`)
      .then((response) => {
        return response.data;
      });
  }

  getGameState() {
    return axios.get(`/api/game/${this.userId}`)
      .then((response) => {
        return response.data;
      });
  }

  getGameList() {
    return axios.get('/api/games')
      .then((response) => {
        return response.data;
      });
  }

  playCards(cardIds: Array<string>) {
    return axios.put(`/api/game/play/${this.userId}`, cardIds).then(() => {});
  }

  unPlayCards() {
    return axios.delete(`/api/game/play/${this.userId}`).then(() => {});
  }

  kickPlayer(playerId: string) {
    return axios.delete(`/api/game/players?${queryString.stringify({
      kickerId: this.userId,
      kickeeId: playerId
    })}`).then(() => {});
  }

  vote(cardId: string) {
    return axios.put(`/api/game/vote/${this.userId}?${queryString.stringify({cardId})}`).then(() => {});
  }

  startNextRound() {
    return axios.put(`/api/game/continue/${this.userId}`).then(() => {});
  }

  sendMessage(message: string) {
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
