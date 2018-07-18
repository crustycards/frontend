import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import Game from '../client/src/pages/Game.jsx';
import {mount} from 'enzyme';
import gameStates from './validGameStates.json';
import {createMockStore} from './helpers';

describe('Game page renders FOV data without error', () => {
  gameStates.forEach((state, index) => {
    it(`renders game state at index ${index}`, () => {
      mount(
        <Provider store={createMockStore(state)}>
          <BrowserRouter>
            <Game/>
          </BrowserRouter>
        </Provider>
      );
    });
  });
});
