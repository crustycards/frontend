import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { RaisedButton, FlatButton, CircularProgress } from 'material-ui';
import { connect } from 'react-redux';
import { joinGame, leaveGame, getGameList } from '../../gameServerInterface';
import { setTimeout } from 'timers';

class GameList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    this.setState({isLoading: true});
    getGameList().then(() => this.setState({isLoading: false}));
  }

  render() {
    if (this.state.isLoading) {
      return <div>
        <h2>Games</h2>
        <div className='center'><CircularProgress size={80} thickness={5} /></div>
      </div>;
    }

    if (!this.props.games.length) {
      return <div className='center'><span>There are no open games to join</span></div>;
    }

    return (
      <div>
        <h2>Games</h2>
        <RaisedButton label='Refresh' onClick={this.refresh} />
        {this.props.games.map((game, index) => (
          <Card style={this.props.game && this.props.game.name === game.name ? {filter: 'brightness(90%)'} : {}} key={index} className='card'>
            <CardHeader
              title={game.name}
              subtitle={`Host: ${game.owner.name}`}
            />
            <CardActions>
              {
                this.props.game && this.props.game.name === game.name ?
                  <FlatButton label='Leave' onClick={() => { leaveGame().then(this.refresh); }} /> :
                  <FlatButton label='Join' onClick={() => { joinGame(game.name); }} />
              }
            </CardActions>
          </Card>
        ))}
      </div>
    );
  }
}

const mapStateToProps = ({game, games}) => ({
  game,
  games
});

export default connect(mapStateToProps)(GameList);