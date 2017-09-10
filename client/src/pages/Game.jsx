import React, { Component } from 'react';
import Navbar from '../components/Navbar.jsx';
import { connect } from 'react-redux';
import { GridList, GridTile } from 'material-ui/GridList';
import { FlatButton } from 'material-ui';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import COHCard from '../components/COHCard.jsx';
import Tray from '../components/GameBoard/Tray.jsx';
import axios from 'axios';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    overflowY: 'auto',
  }
};

class Game extends Component {
  constructor (props) {
    super(props);
    this.state = {
      game: undefined
    };
    this.fetchGameState = this.fetchGameState.bind(this);
    this.playCard = this.playCard.bind(this);
    this.fetchGameState();
  }

  componentDidMount () {
    this.intervalId = setInterval(this.fetchGameState, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.intervalId);
  }

  fetchGameState () {
    axios.get('/api/games/current')
      .then((response) => {
        console.log(response);
        this.setState({game: response.data});
      })
      .catch(() => {
        this.setState({game: null});
      });
  }

  playCard (card) {
    axios.post('/api/games/current/card', card);
  }

  leaveGame () {
    axios.post('/api/games/current/leave');
  }

  render () {
    return (
      <div>
        <Navbar/>
        {this.state.game === undefined ? <div>Loading...</div> :
        this.state.game === null ? <div>Not in a game</div> :
        <div>
          <div>Current game: {this.state.game.gameName}</div>
          <FlatButton label={'Leave game'} onClick={this.leaveGame} />
          <div style={styles.root}>
            <Tray hand={this.state.game.hand} playCard={this.playCard}/>
          </div>
        </div>}
      </div>
    );
  }
}

export default Game;

// const mapStateToProps = ({game}) => (
//   {
//     blackCard: game.blackCard,
//     whiteCards: game.whiteCards,
//     gameName: game.gameName,
//     players: game.players 
//   }
// );

// export default connect(mapStateToProps)(Game);
