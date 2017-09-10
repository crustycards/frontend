import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui';
import axios from 'axios';

class GameList extends React.Component {
  constructor (props) {
    super(props);
    this.socket = props.socket;
    this.state = {
      games: []
    };
    this.socket.on('gamecreate', (game) => {
      this.setState({games: [...this.state.games, JSON.parse(game)]});
    });
    axios.get('/api/games')
      .then((response) => {
        let games = response.data;
        console.log('Games', games);
        this.setState({games});
      });
  }

  render () {
    return (
      <div>
        <div>This is the game list</div>
        {this.state.games.map((game, index) => {
          return (
            <Card key={index} className='card'>
              <CardHeader
                title={game.name}
                subtitle={`Host: ${game.owner.firstname} ${game.owner.lastname} (${game.owner.email})`}
              />
              <CardActions>
                <FlatButton label='Join' onClick={console.log} />
              </CardActions>
            </Card>
          );
        })}
      </div>
    );
  }
}

export default GameList;