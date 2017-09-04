/**
 * DELETE MOCK DATA
 */
const TEXTS = ['foo', 'bar', 'example', 'ipsum'];

export const SET_BLACK_CARD = 'game/SET_BLACK_CARD';
export const SET_WHITE_CARDS = 'game/SET_WHITE_CARDS';
export const ADD_WHITE_CARD = 'game/ADD_WHITE_CARD';
export const SET_HAND = 'game/SET_HAND';
export const ADD_CARD_TO_HAND = 'game/ADD_CARD_TO_HAND';
export const ADD_PLAYER = 'game/ADD_PLAYER';
export const SET_PLAYERS = 'game/SET_PLAYERS';
export const PLAY_CARD = 'game/PLAY_CARD';

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
  players: [],
  hand: [...new Array(4)].map(e => generateMockCard(true))
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
  case SET_BLACK_CARD:
    return {
      ...state,
      blackCard: payload
    };
  case SET_WHITE_CARDS:
    return {
      ...state,
      whiteCards: payload
    };
  case ADD_WHITE_CARD: 
    return {
      ...state,
      whiteCards: state.game.whiteCards.concat([payload])
    };
  case SET_HAND: 
    return {
      ...state,
      hand: payload
    };
  case ADD_CARD_TO_HAND: 
    return {
      ...state,
      hand: state.game.hand.concat([payload]) 
    };
  case SET_PLAYERS:
    return {
      ...state,
      players: payload
    };
  case ADD_PLAYER:
    return {
      ...state,
      players: state.game.players.concat([payload])
    };
  case PLAY_CARD:
    // If the player has the card to play then play it
    if (state.hand.includes(payload)) {
      return {
        ...state,
        hand: state.hand.filter(c => c !== payload),
        whiteCards: state.whiteCards.concat([payload])
      };
    }
    // else do nothing
    return state;
  default:
    return state;
  }
};

export const setBlackCard = payload => ({
  type: SET_BLACK_CARD,
  payload
});

export const setWhiteCards = payload => ({
  type: SET_WHITE_CARDS,
  payload
});

export const addWhiteCard = payload => ({
  type: ADD_WHITE_CARD,
  payload
});

export const setHand = payload => ({
  type: SET_HAND,
  payload
});

export const addCardToHand = payload => ({
  type: ADD_CARD_TO_HAND,
  payload
});

export const setPlayers = payload => ({
  type: SET_PLAYERS,
  payload
});

export const addPlayer = payload => ({
  type: ADD_PLAYER,
  payload
});

export const playCard = payload => ({
  type: PLAY_CARD,
  payload
});


