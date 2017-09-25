import axios from 'axios';

export const FETCH_GAMES = 'games/FETCH_GAMES';
export const SET_CARDPACKS = 'games/SET_CARDPACKS';
export const SET_GAMES = 'games/SET_GAMES';

const initialState = {
  games: [],
  cardPacks: [],
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
  case FETCH_GAMES:
    return {
      ...state,
      games: payload
    };
  case FETCH_GAMES:
    return {
      ...state,
      games: payload
    };
  default:
    return state;
  }
};

export const fetchGames = () => {
  return (dispatch, getState) => {
    axios.get('/api/games')
      .then(({data}) => {
        console.log(data);
        dispatch({
          type: FETCH_GAMES,
          payload: data, 
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
};

/**
 * Game name
 * cardpacks array
 */
export const createGame = ({gameName, cardpackIds}) => {
  return (dispatch, getState) => {
    axios.post('/api/games', {
      gameName,
      cardpackIds
    })
      .then(({data}) => {
        dispatch({
          type: SET_GAMES,
          payload: data, 
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
};
