import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Tray from '../components/GameBoard/Tray.jsx';

class Game extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <Navbar/>
        <div>This is the current game</div>
        <Tray/>
      </div>
    );
  }
}

export default Game;