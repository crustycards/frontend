export class User {
  id: string
  name: string
}

export class WhiteCard {
  id: string
  text: string
  cardpackId: string
}

export class JsonWhiteCard {
  id: string
  text: string
}

export class BlackCard {
  id: string
  text: string
  answerFields: number
  cardpackId: string
}

export class JsonBlackCard {
  id: string
  text: string
  answerFields: number
}

export class Cardpack {
  id: string
  name: string
  owner: User
  whiteCards: Array<WhiteCard>
  blackCards: Array<BlackCard>
  createdAt: Date
}

export class Player extends User {
  score: number
}

export class Message {
  user: User
  text: string
}

export class WhitePlayed {
  [userId: string]: Array<WhiteCard>
}

export class GameData {
  name: string
  maxPlayers: number
  maxScore: number
  stage: string
  hand: Array<WhiteCard>
  players: Array<Player>
  queuedPlayers: Array<Player>
  bannedPlayers: Array<User>
  judgeId: string
  ownerId: string
  whitePlayed: WhitePlayed
  whitePlayedAnonymous: Array<Array<WhiteCard>>
  currentBlackCard: BlackCard
  winner: User
  messages: Array<Message>
}

export class LocalGameData extends GameData {
  queuedCardIds: Array<string>
}

export class GameInfo {
  name: string
  playerCount: number
  maxPlayers: number
  owner: User
}

export class Session {
  id: string
  userId: string
  createdAt: Date
}
