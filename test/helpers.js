import {createStore as createReduxStore} from 'redux';

module.exports.createMockStore = (data) => {
  const reducer = (state = data, {action, payload}) => {
    if (action === 'SET_ENTIRE_STATE') {
      return payload;
    } else {
      return state;
    }
  };
  return createReduxStore(reducer);
};
