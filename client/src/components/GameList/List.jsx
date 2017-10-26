import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import axios from 'axios';

const GameList = (props) => (
  <div>
    <div>This is the game list</div>
    {props.games.map((game, index) => {
      return (
        <Card key={index} className='card'>
          <CardHeader
            title={game.name}
            subtitle={`Host: ${game.owner.name} (${game.owner.email})`}
          />
          <CardActions>
            <FlatButton label='Join' onClick={() => {props.socket.emit('join', game.name)}} />
          </CardActions>
        </Card>
      );
    })}
  </div>
);

const mapStateToProps = (state) => ({
  socket: state.global.socket,
  games: state.games
});

export default connect(mapStateToProps)(GameList);