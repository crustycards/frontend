import {GameView, PlayableWhiteCard} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {getAnswerFieldsForBlackCardInRound} from '../../helpers/proto';

const SET_GAME_STATE = 'game/SET_GAME_STATE';
const QUEUE_CARD = 'game/QUEUE_CARD';
const UNQUEUE_CARD = 'game/UNQUEUE_CARD';

export enum QueuedCardIdType {
  Default,
  Custom,
  Blank
}

export interface QueuedCardId {
  cardName: string;
  cardType: QueuedCardIdType;
}

// TODO - Move some of these helper functions to a separate helper file.

const playableWhiteCardToQueuedCardId =
(card?: PlayableWhiteCard): QueuedCardId | undefined => {
  if (!card) {
    return;
  }

  if (card.hasDefaultWhiteCard()) {
    return {
      cardName: card.getDefaultWhiteCard()?.getName() || '',
      cardType: QueuedCardIdType.Default
    };
  }

  if (card.hasCustomWhiteCard()) {
    return {
      cardName: card.getCustomWhiteCard()?.getName() || '',
      cardType: QueuedCardIdType.Custom
    };
  }

  if (card.hasBlankWhiteCard()) {
    return {
      cardName: card.getBlankWhiteCard()?.getId() || '',
      cardType: QueuedCardIdType.Blank
    };
  }
};

const queuedCardIdsAreEqual = (
  one: QueuedCardId | undefined,
  two: QueuedCardId | undefined
): boolean => {
  if (!one || !two) {
    return false;
  }
  return one.cardName === two.cardName && one.cardType === two.cardType;
};

export const queuedCardIdPointsToPlayableCard =
(queuedCardId: QueuedCardId | null, card: PlayableWhiteCard): boolean => {
  if (!queuedCardId) {
    return false;
  }
  return queuedCardIdsAreEqual(
    queuedCardId, playableWhiteCardToQueuedCardId(card));
};

interface ReduxGameData {
  view?: GameView;
  // The length of this field will always be the same as the
  // current black card's answer field count - or 0 if there
  // is no current black card. This way, users can select
  // cards out of order without them automatically collapsing.
  queuedCardIds: (QueuedCardId | null)[];
}

const cleanseQueuedCardIds = (
  hand: PlayableWhiteCard[],
  maxQueuedCards: number,
  prevQueuedCardIds: (QueuedCardId | null)[]): (QueuedCardId | null)[] => {
  const stringifiedHandCardLookup: Set<string> = hand
    .map((card) => playableWhiteCardToQueuedCardId(card) || null)
    .reduce((acc, id) => {
      acc.add(JSON.stringify(id));
      return acc;
    }, new Set<string>());

  const cleansedQueuedCardIds = [...prevQueuedCardIds]
    .slice(0, maxQueuedCards).map((queuedCardId) => {
      if (queuedCardId === null) {
        return null;
      } else if (stringifiedHandCardLookup.has(JSON.stringify(queuedCardId))) {
        return queuedCardId;
      } else {
        return null;
      }
    });

  while (cleansedQueuedCardIds.length < maxQueuedCards) {
    cleansedQueuedCardIds.push(null);
  }

  return cleansedQueuedCardIds;
};

const defaultState: ReduxGameData = {view: undefined, queuedCardIds: []};

export default (
  state: ReduxGameData = defaultState,
  {type, payload}: {type: string, payload: any}
): ReduxGameData => {
  let queuedCardIds;

  switch (type) {
    case SET_GAME_STATE:
      const gameView: GameView | undefined = payload;
      if (gameView === undefined) {
        return defaultState;
      } else if (gameView.getStage() !== GameView.Stage.PLAY_PHASE
              || !gameView.hasCurrentBlackCard()) {
        // TODO - Also enter this conditional if the
        // current user has already played this round.
        return {view: gameView, queuedCardIds: []};
      } else {
        return {
          view: gameView,
          queuedCardIds: cleanseQueuedCardIds(
            gameView.getHandList(),
            getAnswerFieldsForBlackCardInRound(
              gameView.getCurrentBlackCard()) || 0,
            state.queuedCardIds
          )
        };
      }
    case QUEUE_CARD:
      const queueCardPayload: QueueCardPayload = payload;

      const currentCardIdQueueIndex = state.queuedCardIds.findIndex((id) =>
        queuedCardIdPointsToPlayableCard(id, queueCardPayload.card));
      // If the card we're queueing is already queued up, that
      // means the user is moving it to a different queue spot.
      if (currentCardIdQueueIndex !== -1) {
        if (queueCardPayload.index === undefined) {
          throw new Error('Payload must contain index when moving currently queued card to a new queued position');
        }
        queuedCardIds = [...state.queuedCardIds];

        // Swap queued cards.
        const tempCardId = queuedCardIds[currentCardIdQueueIndex];
        queuedCardIds[currentCardIdQueueIndex] =
          queuedCardIds[queueCardPayload.index];
        queuedCardIds[queueCardPayload.index] = tempCardId;

        return {...state, queuedCardIds};
      }

      let queueCardPayloadIndex = queueCardPayload.index;

      if (typeof queueCardPayloadIndex !== 'number') {
        const openIndex = state.queuedCardIds.findIndex((id) => id === null);
        if (openIndex === -1) {
          return {...state};
        }
        queueCardPayloadIndex = openIndex;
      }

      if (
        state.queuedCardIds[queueCardPayloadIndex] === undefined
      ) {
        return {...state};
      }

      queuedCardIds = [...state.queuedCardIds];
      queuedCardIds[queueCardPayloadIndex] =
        playableWhiteCardToQueuedCardId(queueCardPayload.card) ||
        queuedCardIds[queueCardPayloadIndex];
      return {...state, queuedCardIds};
    case UNQUEUE_CARD:
      const playableWhiteCard: PlayableWhiteCard = payload;
      queuedCardIds = [...state.queuedCardIds];
      const indexToClear = queuedCardIds.findIndex((id) =>
        queuedCardIdPointsToPlayableCard(id, playableWhiteCard));
      if (indexToClear > -1) {
        queuedCardIds[indexToClear] = null;
      }
      return {...state, queuedCardIds};
    default:
      return state;
  }
};

export const setGameState = (payload: GameView | undefined) => ({
  type: SET_GAME_STATE,
  payload
});

interface QueueCardPayload {
  card: PlayableWhiteCard;
  index?: number;
}

export const queueCard = (payload: QueueCardPayload) => ({
  type: QUEUE_CARD,
  payload
});

export const unqueueCard = (card: PlayableWhiteCard) => ({
  type: UNQUEUE_CARD,
  payload: card
});
