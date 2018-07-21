import {GameData, GameInfo} from './dao';

interface GameApiInterface {
  createGame(
    gameName: string,
    maxPlayers: number,
    maxScore: number,
    handSize: number,
    cardpackIds: Array<string>
  ): Promise<GameData>
  startGame(): Promise<GameData>
  stopGame(): Promise<GameData>
  joinGame(gameName: string): Promise<GameData>
  leaveGame(): Promise<void>
  getGameState(): Promise<GameData>
  getGameList(): Promise<Array<GameInfo>>
  playCards(cardIds: Array<string>): Promise<void>
  unPlayCards(): Promise<void>
  kickPlayer(playerId: string): Promise<void>
  vote(cardId: string): Promise<void>
  startNextRound(): Promise<void>
  sendMessage(text: string): Promise<GameData>
}

export default GameApiInterface;
