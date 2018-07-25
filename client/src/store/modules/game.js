export const SET_GAME_STATE = 'game/SET_GAME_STATE';
export const QUEUE_CARD = 'game/QUEUE_CARD';
export const UNQUEUE_CARD = 'game/UNQUEUE_CARD';
export const SET_BLACK_CARD = 'game/SET_BLACK_CARD';
export const SET_WHITE_CARDS = 'game/SET_WHITE_CARDS';
export const ADD_WHITE_CARD = 'game/ADD_WHITE_CARD';
export const SET_HAND = 'game/SET_HAND';
export const ADD_CARD_TO_HAND = 'game/ADD_CARD_TO_HAND';
export const ADD_PLAYER = 'game/ADD_PLAYER';
export const SET_PLAYED_CARDS = 'game/SET_PLAYED_CARDS';

const initialState = null;

export default (state = initialState, {type, payload}) => {
  let queuedCardIds;
  let cardIdQueueIndex;
  let queueAlreadyContainsCardId;

  switch (type) {
    case SET_GAME_STATE:
      if (payload === null) {
        return null;
      } else if (!payload.currentBlackCard) {
        return {...payload, queuedCardIds: []};
      } else if (
        state === null
        || state.queuedCardIds.length !== payload.currentBlackCard.answerFields
        || !state.queuedCardIds.reduce(
          (acc, id) => (acc && (id === null || payload.hand.map((card) => card.id).includes(id))),
          true
        )
      ) {
        const queuedCardIds = [];
        for (let i = 0; i < payload.currentBlackCard.answerFields; i++) {
          queuedCardIds.push(null);
        }
        return {...payload, queuedCardIds};
      } else {
        return {...payload, queuedCardIds: state.queuedCardIds};
      }
    case QUEUE_CARD:
      cardIdQueueIndex = state.queuedCardIds.findIndex((id) => id === payload.cardId);
      queueAlreadyContainsCardId = cardIdQueueIndex !== -1;
      if (queueAlreadyContainsCardId) {
        if (payload.index === undefined) {
          throw new Error(
            'Payload must contain index when moving currently queued card to a new queued position'
          );
        }
        queuedCardIds = [...state.queuedCardIds];
        queuedCardIds[cardIdQueueIndex] = queuedCardIds[payload.index];
        queuedCardIds[payload.index] = payload.cardId;

        return {...state, queuedCardIds};
      } else if (typeof payload.index !== 'number') {
        const openIndex = state.queuedCardIds.findIndex((id) => id === null);
        if (openIndex === -1) {
          return {...state, queuedCardIds: state.queuedCardIds};
        }
        // TODO - Don't edit the payload in the line below since it screws with redux dev tools
        payload.index = openIndex;
      }

      if (
        payload.index < 0 ||
        payload.index > state.hand.length ||
        state.queuedCardIds.includes(payload.cardId)
      ) {
        return {...state, queuedCardIds: state.queuedCardIds};
      }

      queuedCardIds = [...state.queuedCardIds];
      queuedCardIds[payload.index] = payload.cardId;
      return {...state, queuedCardIds};
    case UNQUEUE_CARD:
      queuedCardIds = [...state.queuedCardIds];
      queuedCardIds[queuedCardIds.findIndex((id) => id === payload)] = null;
      return {...state, queuedCardIds};
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
    case SET_PLAYED_CARDS:
      return {
        ...state,
        hand: state.hand.filter((c) => !payload.includes(c.id))
      // TODO - Add white cards to played cards object
      };
    default:
      return state;
  }
};

export const setGameState = (payload) => ({
  type: SET_GAME_STATE,
  payload
});

export const queueCard = (payload) => ({
  type: QUEUE_CARD,
  payload
});

export const unqueueCard = (payload) => ({
  type: UNQUEUE_CARD,
  payload
});

export const setPlayedCards = (payload) => ({
  type: SET_PLAYED_CARDS,
  payload
});
