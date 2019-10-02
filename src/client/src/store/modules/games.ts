import {GameInfo} from '../../api/dao';

const ADD_GAME = 'games/ADD_GAME';
const REMOVE_GAME = 'games/REMOVE_GAME';
const SET_GAMES = 'games/SET_GAMES';

export default (state: GameInfo[] = [], {type, payload}: {type: string, payload: any}): GameInfo[] => {
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

export const setGameList = (games: GameInfo[]) => ({
  type: SET_GAMES,
  payload: games
});
