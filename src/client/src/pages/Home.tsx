import {Grid} from '@material-ui/core';
import * as React from 'react';
import FrienderPanel from '../components/FrienderPanel';

const Home = () => (
  <div className='content-wrap'>
    <Grid container spacing={8}>
      <Grid item xs={12} sm={6} md={4}>
        <FrienderPanel/>
      </Grid>
      <Grid item xs={12} sm={6} md={8}>
      </Grid>
    </Grid>
  </div>
);

export default Home;
