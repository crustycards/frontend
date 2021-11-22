import {Typography} from '@mui/material';
import * as React from 'react';
import GoogleButton from '../components/GoogleButton/index';
import {Center} from '../styles/globalStyles';

const LoginPage = () => (
  <Center>
    <Typography variant={'h4'}>Login</Typography>
    <GoogleButton onClick={() => window.location.href = '/auth/google'} />
  </Center>
);

export default LoginPage;
