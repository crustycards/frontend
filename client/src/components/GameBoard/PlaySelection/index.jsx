import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tray from './Tray.jsx';
import PlayArea from './PlayArea.jsx';

class PlaySelection extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    return <div><Tray/><PlayArea/></div>;
  }
}

export default PlaySelection;