import * as React from 'react';
import {Redirect} from 'react-router-dom';

const HomePage = () => (<Redirect to={'/gamelist'} />);

export default HomePage;
