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

export class GameData {
  // TODO - Add data fields
}

export class GameInfo {
  // TODO - Add data fields
}
