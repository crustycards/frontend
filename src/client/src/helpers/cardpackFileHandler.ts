import {BlackCard, Cardpack, WhiteCard} from '../../../../proto-gen-out/api/model_pb';

// TODO - Implement and test all functions in this file.

interface CardpackAndCards {
  cardpack: Cardpack;
  blackCards: BlackCard[];
  whiteCards: WhiteCard[];
}

export const stringifyToJson = (cardpackAndCards: CardpackAndCards): string => {
  return JSON.stringify({
    cardpack: cardpackAndCards.cardpack.toObject(),
    whiteCards: cardpackAndCards.whiteCards
      .map((whiteCard) => (whiteCard.toObject())),
    blackCards: cardpackAndCards.blackCards
      .map((blackCard) => (blackCard.toObject()))
  }, null, 2).replace(/\n/g, '\r\n');
};

export const parseFromJson = (str: string): CardpackAndCards => {
  // TODO - Implement and test.
  return {
    cardpack: new Cardpack(),
    blackCards: [],
    whiteCards: []
  };
};

export const stringifyToPlainText =
(cardpackAndCards: CardpackAndCards): string => {
  // TODO - Implement and test.
  return '';
};

export const parseFromPlainText = (str: string): CardpackAndCards => {
  // TODO - Implement and test.
  return {
    cardpack: new Cardpack(),
    blackCards: [],
    whiteCards: []
  };
};
