import * as React from 'react';
import GoogleButton from '../components/GoogleButton/index';

const Login = () => (
  <div className='login center'>
    <h1>Login</h1>
    <GoogleButton onClick={() => window.location.href = '/auth/google'} />
  </div>
);

export default Login;
