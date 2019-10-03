// import * as React from 'react';
// import {Provider} from 'react-redux';
// import {mount} from 'enzyme';
// import {createMockStore} from '../helpers';
// import {Provider as ApiContextProvider} from '../../src/client/src/api/context';
// import {createBrowserHistory} from 'history';
// import {MuiThemeProvider, createMuiTheme} from '@material-ui/core';
// import {ConnectedRouter} from 'connected-react-router';
// import HttpAuthApi from '../../src/client/src/api/http/httpAuthApi';
// import HttpGameApi from '../../src/client/src/api/http/httpGameApi';
// import HttpMainApi from '../../src/client/src/api/http/httpMainApi';
// import AuthApi from '../../src/client/src/api/model/authApi';
// import GameApi from '../../src/client/src/api/model/gameApi';
// import MainApi from '../../src/client/src/api/model/mainApi';

export const generateTests = (Component: () => JSX.Element, states: any[]) => {
  describe(`${Component.constructor.name} page renders states without error`, () => {
    // TODO - Uncomment everything below
    states.forEach((state, index) => {
      // const history = createBrowserHistory();
      // const store = createMockStore(state, history);
      // const theme = createMuiTheme();

      // const mainApi: MainApi = new HttpMainApi('userId');
      // const gameApi: GameApi = new HttpGameApi('userId');
      // const authApi: AuthApi = new HttpAuthApi('userId');

      it(`renders state at index ${index}`, () => {
        // mount(
        //   <MuiThemeProvider theme={theme}>
        //     <Provider store={store}>
        //       <ConnectedRouter history={history}>
        //         <ApiContextProvider value={{main: mainApi, game: gameApi, auth: authApi}}>
        //           <Component/>
        //         </ApiContextProvider>
        //       </ConnectedRouter>
        //     </Provider>
        //   </MuiThemeProvider>
        // );
      });
    });
  });
};
