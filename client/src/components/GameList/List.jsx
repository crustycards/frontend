import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import { joinGame } from '../../gameServerInterface';
import axios from 'axios';

const GameList = (props) => (
  <div>
    <div>This is the game list</div>
    {props.games.map((game, index) => (
      <Card key={index} className='card'>
        <CardHeader
          title={game.name}
          subtitle={`Host: ${game.owner.name} (${game.owner.email})`}
        />
        <CardActions>
          <FlatButton label='Join' onClick={() => {joinGame(game.name)}} />
        </CardActions>
      </Card>
    ))}
  </div>
);

const mapStateToProps = (state) => ({
  games: state.games
});

export default connect(mapStateToProps)(GameList);