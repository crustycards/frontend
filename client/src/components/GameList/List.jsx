import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import { joinGame, leaveGame } from '../../gameServerInterface';

const GameList = (props) => (
  props.games.length ?
    <div>
      <h2>Join Game</h2>
      {props.games.map((game, index) => (
        <Card key={index} className='card'>
          <CardHeader
            title={game.name}
            subtitle={`Host: ${game.owner.name} (${game.owner.email})`}
          />
          <CardActions>
            {
              props.game && props.game.name === game.name ?
                <FlatButton label='Leave' onClick={leaveGame} /> :
                <FlatButton label='Join' onClick={() => { joinGame(game.name); }} />
            }
          </CardActions>
        </Card>
      ))}
    </div>
    :
    <div className='center'><span>There are no open games to join</span></div>
);

const mapStateToProps = ({game, games}) => ({
  game,
  games
});

export default connect(mapStateToProps)(GameList);