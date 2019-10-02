export interface User {
  id: string;
  name: string;
}

export interface WhiteCard {
  id: string;
  text: string;
  cardpackId: string;
}

export interface JsonWhiteCard {
  text: string;
}

export interface BlackCard {
  id: string;
  text: string;
  answerFields: number;
  cardpackId: string;
}

export interface JsonBlackCard {
  text: string;
  answerFields: number;
}

export interface Cardpack {
  id: string;
  name: string;
  owner: User;
  whiteCards: WhiteCard[];
  blackCards: BlackCard[];
  createdAt: Date;
}

export interface Player extends User {
  score: number;
}

export interface Message {
  user: User;
  text: string;
}

export interface WhitePlayedEntry {
  cards: WhiteCard[];
  player: RealOrArtificialPlayer;
}

export interface ArtificialPlayer {
  name: string;
  score: number;
}

export interface RealOrArtificialPlayer {
  user?: User;
  artificialPlayerName?: string;
}

export interface PastRound {
  blackCard: BlackCard;
  whitePlayed: WhitePlayedEntry[];
  judge: User;
  winner: RealOrArtificialPlayer;
}

export interface GameData {
  name: string;
  maxPlayers: number;
  maxScore: number;
  stage: string;
  hand: WhiteCard[];
  players: Player[];
  artificialPlayers: ArtificialPlayer[];
  queuedPlayers: Player[];
  queuedArtificialPlayers: ArtificialPlayer[];
  bannedPlayers: User[];
  judgeId: string;
  ownerId: string;
  whitePlayed: WhitePlayedEntry[];
  whitePlayedAnonymous: WhiteCard[][];
  currentBlackCard: BlackCard;
  winner: RealOrArtificialPlayer;
  messages: Message[];
  pastRounds: PastRound[];
}

export interface LocalGameData extends GameData {
  queuedCardIds: string[];
}

export interface GameInfo {
  name: string;
  playerCount: number;
  maxPlayers: number;
  running: boolean;
  lastActivity: Date;
  owner: User;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: Date;
}
