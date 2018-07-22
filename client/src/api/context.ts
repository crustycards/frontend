import * as React from 'react';

import ApiInterface from './apiInterface';
import GameApiInterface from './gameApiInterface';

import HttpApi from './httpApi';
import HttpGameApi from './httpGameApi';

interface ApiContext {
  api: ApiInterface
  gameApi: GameApiInterface
}

const Context = React.createContext<ApiContext>({
  api: new HttpApi(''),
  gameApi: new HttpGameApi('')
});

export const Provider = Context.Provider;
export const Consumer = Context.Consumer;
