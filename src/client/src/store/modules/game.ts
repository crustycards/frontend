import { GameData, WhiteCard } from '../../api/dao';

const SET_GAME_STATE = 'game/SET_GAME_STATE';
const QUEUE_CARD = 'game/QUEUE_CARD';
const UNQUEUE_CARD = 'game/UNQUEUE_CARD';
const SET_HAND = 'game/SET_HAND';
const ADD_CARD_TO_HAND = 'game/ADD_CARD_TO_HAND';
const ADD_PLAYER = 'game/ADD_PLAYER';

interface ReduxGameData extends GameData {
  queuedCardIds: string[]
}

export default (state: ReduxGameData = null, {type, payload}: {type: string, payload: any}): ReduxGameData => {
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
          (acc, id) => (acc && (id === null || payload.hand.map((card: WhiteCard) => card.id).includes(id))),
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
    default:
      return state;
  }
};

export const setGameState = (payload: GameData) => ({
  type: SET_GAME_STATE,
  payload
});

export const queueCard = (payload: {index: number, cardId: string}) => ({
  type: QUEUE_CARD,
  payload
});

export const unqueueCard = (cardId: string) => ({
  type: UNQUEUE_CARD,
  payload: cardId
});