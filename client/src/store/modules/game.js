/**
 * TYPES
 */
export const SET_GAME_STATE = 'game/SET_GAME_STATE';
export const SET_BLACK_CARD = 'game/SET_BLACK_CARD';
export const SET_WHITE_CARDS = 'game/SET_WHITE_CARDS';
export const ADD_WHITE_CARD = 'game/ADD_WHITE_CARD';
export const SET_HAND = 'game/SET_HAND';
export const ADD_CARD_TO_HAND = 'game/ADD_CARD_TO_HAND';
export const ADD_PLAYER = 'game/ADD_PLAYER';
export const PLAY_CARD = 'game/PLAY_CARD';

const initialState = {
  name: null,
  blackCard: null,
  whiteCards: [],
  judgeId: null,
  ownerId: null,
  players: [],
  hand: [],
  roundPhase: null
};

/**
 * Reducer
 */
export default (state = initialState, {type, payload}) => {
  switch (type) {
  case SET_GAME_STATE:
    return {
      ...payload
    };
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
  case ADD_PLAYER:
    return {
      ...state,
      players: state.game.players.concat([payload])
    };
  case PLAY_CARD:
    // If the player has the card to play then play it
    if (state.game.hand.includes(payload)) {
      return {
        ...state,
        hand: state.game.hand.filter(c => c !== payload),
        whiteCards: state.game.whiteCards.concat([payload])
      };
    }
    // else do nothing
    return state;
  default:
    return state;
  }
};

export const playCard = payload => ({
  type: PLAY_CARD,
  payload
});