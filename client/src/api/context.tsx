import * as React from 'react';
import { Subtract } from 'utility-types';

import ApiInterface from './apiInterface';
import GameApiInterface from './gameApiInterface';

import HttpApi from './httpApi';
import HttpGameApi from './httpGameApi';

interface InjectedApiProps {
  api: ApiInterface
  gameApi: GameApiInterface
}

const Context = React.createContext<InjectedApiProps>({
  api: new HttpApi(''),
  gameApi: new HttpGameApi('')
});

export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

export const ApiContextWrapper = <P extends InjectedApiProps>(Component: React.ComponentType<P>) => (
  class ApiContextWrapper extends React.Component<Subtract<P, InjectedApiProps>> {
    render() {
      return (
        <Consumer>
          {({api, gameApi}) => (<Component api={api} gameApi={gameApi} {...this.props} {...this.state}/>)}
        </Consumer>
      );
    }
  }
);