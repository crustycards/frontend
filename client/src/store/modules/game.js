/**
 * TYPES
 */
export const SET_GAME_STATE = 'game/SET_GAME_STATE';
export const QUEUE_CARD = 'game/QUEUE_CARD';
export const UNQUEUE_CARD = 'game/UNQUEUE_CARD';
export const SET_BLACK_CARD = 'game/SET_BLACK_CARD';
export const SET_WHITE_CARDS = 'game/SET_WHITE_CARDS';
export const ADD_WHITE_CARD = 'game/ADD_WHITE_CARD';
export const SET_HAND = 'game/SET_HAND';
export const ADD_CARD_TO_HAND = 'game/ADD_CARD_TO_HAND';
export const ADD_PLAYER = 'game/ADD_PLAYER';
export const PLAY_CARD = 'game/PLAY_CARD';

const initialState = null;

/**
 * Reducer
 */
export default (state = initialState, {type, payload}) => {
  switch (type) {
  case SET_GAME_STATE:
    return payload ? {...payload, queuedCardIds: state ? state.queuedCardIds.filter(id => payload.hand.map(card => card.id).includes(id)) : []} : null;
  case QUEUE_CARD:
    return {...state, queuedCardIds: [...state.queuedCardIds, payload]};
  case UNQUEUE_CARD:
    return {...state, queuedCardIds: state.queuedCardIds.filter(id => id !== payload)};
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
      whiteCards: state.whiteCards.concat([payload])
    };
  case SET_HAND:
    return {
      ...state,
      hand: payload
    };
  case ADD_CARD_TO_HAND:
    return {
      ...state,
      hand: state.hand.concat([payload])
    };
  case ADD_PLAYER:
    return {
      ...state,
      players: state.players.concat([payload])
    };
  case PLAY_CARD:
    // If the player has the card to play then play it
    if (state.hand.includes(payload)) {
      return {
        ...state,
        hand: state.hand.filter(c => c !== payload),
        // TODO - Potentially fix the line below
        whiteCards: state.whiteCards.concat([payload])
      };
    }
    // else do nothing
    return state;
  default:
    return state;
  }
};

export const setGameState = payload => ({
  type: SET_GAME_STATE,
  payload
});

export const queueCard = payload => ({
  type: QUEUE_CARD,
  payload
});

export const unqueueCard = payload => ({
  type: UNQUEUE_CARD,
  payload
});

export const playCard = payload => ({
  type: PLAY_CARD,
  payload
});