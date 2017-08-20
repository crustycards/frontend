import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../components/Navbar.jsx';
import CardpackViewer from '../components/CardpackViewer.jsx';

class Cardpack extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      id: this.props.location.query.id || null
    };
  }

  render() {
    return (
      <div>
        <Navbar/>
        <CardpackViewer cardpackId={this.state.id} socket={this.socket} />
      </div>
    );
  }
}

export default Cardpack;