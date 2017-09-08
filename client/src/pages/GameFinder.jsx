import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchGames, createGame } from '../store/modules/games';
import { FlatButton } from 'material-ui';

import Navbar from '../components/Navbar.jsx';
import NewGame from '../components/GameFinder/NewGame.jsx';

const GameFinder = ({games, fetchGames, createGame}) => (
  <div>
    <Navbar />
    <FlatButton 
      onClick={fetchGames} 
      label="Fetch Games" 
    />
    <NewGame />
    {games.map(g => <div>{g.name}</div>)}
  </div>
);

const mapStateToProps = ({games}) => ({
  games: games.games
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchGames,
  createGame
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameFinder);
