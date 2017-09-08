import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../components/Navbar.jsx';
import CardpackViewer from '../components/CardpackViewer/index.jsx';
import queryString from 'query-string';

class Cardpack extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      id: queryString.parse(props.location.search).id || null
    };
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div className='content-wrap'>
          <CardpackViewer cardpackId={this.state.id} socket={this.socket} />
        </div>
      </div>
    );
  }
}

export default Cardpack;