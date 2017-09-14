import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Creator from '../components/GameList/Creator.jsx';
import List from '../components/GameList/List.jsx';

class GameList extends React.Component {
  constructor (props) {
    super(props);
    this.socket = io();
  }

  render () {
    return (
      <div>
        <Creator/>
        <List socket={this.socket}/>
      </div>
    );
  }
}

export default GameList;