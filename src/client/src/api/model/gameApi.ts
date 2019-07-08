import {GameData, GameInfo} from '../dao';

interface GameApi {
  createGame(
    gameName: string,
    maxPlayers: number,
    maxScore: number,
    handSize: number,
    cardpackIds: string[]
  ): Promise<GameData>;
  startGame(): Promise<GameData>;
  stopGame(): Promise<GameData>;
  joinGame(gameName: string): Promise<GameData>;
  leaveGame(): Promise<void>;
  addArtificialPlayer(artificialPlayerName: string): Promise<GameData>;
  removeArtificialPlayer(artificialPlayerName: string): Promise<GameData>;
  addArtificialPlayers(amount: number): Promise<GameData>;
  removeArtificialPlayers(amount: number): Promise<GameData>;
  getGameState(): Promise<GameData>;
  getGameList(): Promise<GameInfo[]>;
  playCards(cardIds: string[]): Promise<void>;
  unPlayCards(): Promise<void>;
  kickPlayer(playerId: string): Promise<void>;
  vote(cardId: string): Promise<void>;
  startNextRound(): Promise<void>;
  sendMessage(text: string): Promise<GameData>;
}

export default GameApi;
