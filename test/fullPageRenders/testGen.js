import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {mount} from 'enzyme';
import {createMockStore} from '../helpers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

module.exports.generateTests = (Component, states) => {
  describe(`${Component.constructor.name} page renders states without error`, () => {
    states.forEach((state, index) => {
      it(`renders state at index ${index}`, () => {
        mount(
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <Provider store={createMockStore(state)}>
              <BrowserRouter>
                <Component/>
              </BrowserRouter>
            </Provider>
          </MuiThemeProvider>
        );
      });
    });
  });
};
