import {createStore} from 'redux';
import {History} from 'history';
import createRootReducer from '../src/client/src/store/modules';
import {StoreState} from '../src/client/src/store';

export const createMockStore = (initialState: StoreState, history: History) => { // Change data: any from any to the typescript type of the Redux store
  const reducer = createRootReducer(history);
  return createStore(reducer, initialState);
};
