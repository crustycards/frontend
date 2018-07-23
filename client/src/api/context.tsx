import * as React from 'react';
import { Subtract } from 'utility-types';

import Api from './model/api';

interface InjectedApiProps {
  api: Api
}

const Context = React.createContext<Api>(undefined);

export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

export const ApiContextWrapper = <P extends InjectedApiProps>(Component: React.ComponentType<P>) => (
  class ApiContextWrapper extends React.Component<Subtract<P, InjectedApiProps>> {
    render() {
      return (
        <Consumer>
          {(api) => (<Component api={api} {...this.props} {...this.state}/>)}
        </Consumer>
      );
    }
  }
);