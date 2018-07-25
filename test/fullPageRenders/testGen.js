import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {mount} from 'enzyme';
import {createMockStore} from '../helpers';

module.exports.generateTests = (Component, states) => {
  describe(`${Component.constructor.name} page renders states without error`, () => {
    states.forEach((state, index) => {
      it(`renders state at index ${index}`, () => {
        mount(
          <Provider store={createMockStore(state)}>
            <BrowserRouter>
              <Component/>
            </BrowserRouter>
          </Provider>
        );
      });
    });
  });
};
