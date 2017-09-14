import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
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
      <div className='content-wrap'>
        <CardpackViewer cardpackId={this.state.id} socket={this.socket} />
      </div>
    );
  }
}

export default Cardpack;