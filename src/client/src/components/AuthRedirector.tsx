import * as React from 'react';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {StoreState} from '../store';

const AuthRedirector = () => {
  const {user, path} = useSelector(({global: {user}, router}: StoreState) => ({
    user,
    path: router.location.pathname
  }));

  if (user && path === '/login') {
    return <Redirect to={'/'} />;
  } else if (!user && path !== '/login') {
    return <Redirect to={'/login'} />;
  } else {
    return null;
  }
};

export default AuthRedirector;
