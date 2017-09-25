import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { FlatButton } from 'material-ui';
import { connect } from 'react-redux';
import axios from 'axios';

class GameList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      games: []
    };
    props.socket.on('gamecreate', (game) => {
      this.setState({games: [...this.state.games, game]});
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
                subtitle={`Host: ${game.owner.name} (${game.owner.email})`}
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

const mapStateToProps = ({global}) => ({
  socket: global.socket
});

export default connect(mapStateToProps)(GameList);