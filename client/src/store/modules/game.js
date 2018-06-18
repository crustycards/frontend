/**
 * TYPES
 */
export const SET_GAME_STATE = 'game/SET_GAME_STATE'
export const QUEUE_CARD = 'game/QUEUE_CARD'
export const UNQUEUE_CARD = 'game/UNQUEUE_CARD'
export const SET_BLACK_CARD = 'game/SET_BLACK_CARD'
export const SET_WHITE_CARDS = 'game/SET_WHITE_CARDS'
export const ADD_WHITE_CARD = 'game/ADD_WHITE_CARD'
export const SET_HAND = 'game/SET_HAND'
export const ADD_CARD_TO_HAND = 'game/ADD_CARD_TO_HAND'
export const ADD_PLAYER = 'game/ADD_PLAYER'
export const SET_PLAYED_CARDS = 'game/SET_PLAYED_CARDS'

const initialState = null

/**
 * Reducer
 */
export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_GAME_STATE:
      return payload ? {...payload, queuedCardIds: state ? state.queuedCardIds.filter(id => payload.hand.map(card => card.id).includes(id)) : []} : null
    case QUEUE_CARD:
      return {...state, queuedCardIds: [...state.queuedCardIds, payload]}
    case UNQUEUE_CARD:
      return {...state, queuedCardIds: state.queuedCardIds.filter(id => id !== payload)}
    case SET_BLACK_CARD:
      return {
        ...state,
        blackCard: payload
      }
    case SET_WHITE_CARDS:
      return {
        ...state,
        whiteCards: payload
      }
    case ADD_WHITE_CARD:
      return {
        ...state,
        whiteCards: state.whiteCards.concat([payload])
      }
    case SET_HAND:
      return {
        ...state,
        hand: payload
      }
    case ADD_CARD_TO_HAND:
      return {
        ...state,
        hand: state.hand.concat([payload])
      }
    case ADD_PLAYER:
      return {
        ...state,
        players: state.players.concat([payload])
      }
    case SET_PLAYED_CARDS:
      return {
        ...state,
        hand: state.hand.filter(c => !payload.includes(c.id))
      // TODO - Add white cards to played cards object
      }
    default:
      return state
  }
}

export const setGameState = payload => ({
  type: SET_GAME_STATE,
  payload
})

export const queueCard = payload => ({
  type: QUEUE_CARD,
  payload
})

export const unqueueCard = payload => ({
  type: UNQUEUE_CARD,
  payload
})

export const setPlayedCards = payload => ({
  type: SET_PLAYED_CARDS,
  payload
})
