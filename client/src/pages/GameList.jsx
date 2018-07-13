import React from 'react';
import Creator from '../components/GameList/Creator.jsx';
import List from '../components/GameList/List.jsx';
import {Divider} from '@material-ui/core';
import {connect} from 'react-redux';

const GameList = (props) => (
  <div className='content-wrap'>
    <div className='panel'>
      <Creator/>
      <Divider style={{marginTop: '10px', marginBottom: '10px'}} />
      <List/>
    </div>
  </div>
);

const mapStateToProps = ({games}) => ({games});

export default connect(mapStateToProps)(GameList);
