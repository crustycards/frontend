export class User {
  public id: string;
  public name: string;
}

export class WhiteCard {
  public id: string;
  public text: string;
  public cardpackId: string;
}

export class JsonWhiteCard {
  public text: string;
}

export class BlackCard {
  public id: string;
  public text: string;
  public answerFields: number;
  public cardpackId: string;
}

export class JsonBlackCard {
  public text: string;
  public answerFields: number;
}

export class Cardpack {
  public id: string;
  public name: string;
  public owner: User;
  public whiteCards: WhiteCard[];
  public blackCards: BlackCard[];
  public createdAt: Date;
}

export class Player extends User {
  public score: number;
}

export class Message {
  public user: User;
  public text: string;
}

export class WhitePlayed {
  [userId: string]: WhiteCard[]
}

export class GameData {
  public name: string;
  public maxPlayers: number;
  public maxScore: number;
  public stage: string;
  public hand: WhiteCard[];
  public players: Player[];
  public queuedPlayers: Player[];
  public bannedPlayers: User[];
  public judgeId: string;
  public ownerId: string;
  public whitePlayed: WhitePlayed;
  public whitePlayedAnonymous: WhiteCard[][];
  public currentBlackCard: BlackCard;
  public winner: User;
  public messages: Message[];
}

export class LocalGameData extends GameData {
  public queuedCardIds: string[];
}

export class GameInfo {
  public name: string;
  public playerCount: number;
  public maxPlayers: number;
  public owner: User;
}

export class Session {
  public id: string;
  public userId: string;
  public createdAt: Date;
}
