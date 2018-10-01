// import * as React from 'react';
// import {Provider} from 'react-redux';
// import {BrowserRouter} from 'react-router-dom';
// import {mount} from 'enzyme';
// import {createMockStore} from '../helpers';
// import {Provider as ApiContextProvider} from '../../src/client/src/api/context';

export const generateTests = (Component: () => JSX.Element, states: any[]) => {
  describe(`${Component.constructor.name} page renders states without error`, () => {
    states.forEach((state, index) => {
      it(`renders state at index ${index}`, () => {
        // TODO - Uncomment below
        // mount(
        //   <Provider store={createMockStore(state)}>
        //     <BrowserRouter>
        //       <ApiContextProvider // TODO - Replace context with mocked api
        //         value={{
        //           main: {getCardpacksByUser: () => Promise.resolve([])},
        //           game: {getGameList: () => Promise.resolve([])}
        //         }}
        //       >
        //         <Component/>
        //       </ApiContextProvider>
        //     </BrowserRouter>
        //   </Provider>
        // );
      });
    });
  });
};
