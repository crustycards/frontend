import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
  }

  render() {
    return (
      <div>
        <div>Homepage</div>
      </div>
    ) 
  }
}

export default Home;