import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Creator from '../components/GameList/Creator.jsx';
import List from '../components/GameList/List.jsx';

class GameList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <Navbar />
        <Creator/>
        <List/>
      </div>
    );
  }
}

export default GameList;