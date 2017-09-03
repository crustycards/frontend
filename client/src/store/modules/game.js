const TEXTS = ['foo', 'bar', 'example', 'ipsum'];

export const SET_BLACK_CARD = 'game/SET_BLACK_CARD';
export const SET_WHITE_CARDS = 'game/SET_WHITE_CARDS';
export const ADD_WHITE_CARD = 'game/ADD_WHITE_CARD';

const generateMockCard = isWhite => ({
  id: Math.round(Math.random() * 100),
  text: TEXTS[Math.trunc(Math.random() * TEXTS.length)],
  type: isWhite ? 'white' : 'black',
  answerFields: Math.round(Math.random() * 3)
});

const initialState = {
  blackCard: generateMockCard(false),
  whiteCards: [...new Array(4)].map(e => generateMockCard(true)),
  gameName: 'test_game_name_please_ignore',
  players: []
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
  default:
    return state;
  }
};


