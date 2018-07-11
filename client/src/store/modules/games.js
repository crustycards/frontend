export const ADD_GAME = 'games/ADD_GAME';
export const REMOVE_GAME = 'games/REMOVE_GAME';
export const SET_GAMES = 'games/SET_GAMES';

const initialState = [];

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case ADD_GAME:
      return [
        ...state,
        payload
      ];
    case REMOVE_GAME:
      return state.filter((game) => {
        return game.name !== payload;
      });
    case SET_GAMES:
      return [
        ...payload
      ];
    default:
      return state;
  }
};

export const setGameList = (payload) => ({
  type: SET_GAMES,
  payload
});
