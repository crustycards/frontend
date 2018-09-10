import * as React from 'react';
import Creator from '../components/GameList/Creator';
import List from '../components/GameList/List';
import {Divider} from '@material-ui/core';

const GameList = () => (
  <div className='content-wrap'>
    <div className='panel'>
      <Creator/>
      <Divider style={{marginTop: '10px', marginBottom: '10px'}} />
      <List/>
    </div>
  </div>
);

export default GameList;
