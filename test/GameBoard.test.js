import React from 'react';
import {Provider} from 'react-redux';
import {createStore as createReduxStore} from 'redux';
import {BrowserRouter} from 'react-router-dom';
import Game from '../client/src/pages/Game.jsx';
import {mount} from 'enzyme';
import gameStates from './validGameStates.json';

const createStore = (data) => {
  const reducer = (state = data, {action, payload}) => {
    if (action === 'SET_ENTIRE_STATE') {
      return payload;
    } else {
      return state;
    }
  };
  return createReduxStore(reducer);
};

describe('Game page renders FOV data without error', () => {
  gameStates.forEach((state, index) => {
    it(`renders game state at index ${index}`, () => {
      mount(
        <Provider store={createStore(state)}>
          <BrowserRouter>
            <Game/>
          </BrowserRouter>
        </Provider>
      );
    });
  });
});
