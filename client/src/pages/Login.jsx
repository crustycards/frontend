import React from 'react';
import GoogleButton from '../components/GoogleButton/index.tsx';

const Login = () => (
  <div className='login center'>
    <h1>Login</h1>
    <GoogleButton className='btn' onClick={() => window.location.href = '/auth/google'} />
  </div>
);

export default Login;
