const fileHandler = require('../../../client/src/helpers/cardpackFileHandler');

let dummyCards = {whiteCards: [], blackCards: []};

for (let i = 0; i < 10; i++) {
  dummyCards.whiteCards.push({
    text: 'card' + i
  });

  dummyCards.blackCards.push({
    text: 'card' + i,
    answerFields: (i % 3) + 1
  });
}

it('Should get back deeply equal card objects after stringifying and re-parsing', () => {
  expect(fileHandler.parse(fileHandler.stringify(dummyCards))).toEqual(dummyCards);
});

describe('parse', () => {
  // TODO - Write tests here
});

describe('stringify', () => {
  it('Should not modify input array', () => {
    let cardsNonref = JSON.parse(JSON.stringify(dummyCards));
    fileHandler.stringify(cardsNonref);
    expect(cardsNonref).toEqual(dummyCards);
  });
});
