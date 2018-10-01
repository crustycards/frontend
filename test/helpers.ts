import {createStore as createReduxStore} from 'redux';

export const createMockStore = (data: any) => {
  const reducer = (state = data, {action, payload}: any) => {
    if (action === 'SET_ENTIRE_STATE') {
      return payload;
    } else {
      return state;
    }
  };

  return createReduxStore(reducer);
};
