import * as React from 'react';
import {useContext} from 'react';
import Api from './model/api';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface InjectedApiProps {
  api: Api;
}

const Context = React.createContext<Api>(undefined);

export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

export const ApiContextWrapper = <P extends InjectedApiProps, R = Omit<P, 'api'>>
(Component: React.ComponentType<P>): React.SFC<R> => ((props: any) => ( // TODO - Remove 'any'
  <Consumer>
    {(api) => (<Component api={api} {...{...props, api}}/>)}
  </Consumer>
));

export const useApi = () => {
  return useContext(Context);
};
