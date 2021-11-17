import {Typography} from '@mui/material';
import * as React from 'react';
import GoogleButton from '../components/GoogleButton/index';
import {useGlobalStyles} from '../styles/globalStyles';

const LoginPage = () => {
  const globalClasses = useGlobalStyles();
  return (
    <div className={globalClasses.center}>
      <Typography variant={'h4'}>Login</Typography>
      <GoogleButton onClick={() => window.location.href = '/auth/google'} />
    </div>
  );
};

export default LoginPage;
