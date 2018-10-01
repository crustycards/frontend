import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {ApiContextWrapper} from '../../api/context';
import {GameData, GameInfo} from '../../api/dao';
import Api from '../../api/model/api';

const styles = (theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});

interface GameListProps extends WithStyles<typeof styles> {
  api: Api;
  games: GameInfo[];
  game?: GameData;
}

interface GameListState {
  isLoading: boolean;
}

class GameList extends Component<GameListProps, GameListState> {
  constructor(props: GameListProps) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.refresh = this.refresh.bind(this);
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    this.setState({isLoading: true});
    this.props.api.game.getGameList().then(() => this.setState({isLoading: false}));
  }

  public render() {
    if (this.state.isLoading) {
      return <div>
        <h2>Games</h2>
        <div className='center'><CircularProgress size={80} thickness={5} /></div>
      </div>;
    }

    return (
      <div>
        <h2>Games</h2>
        <Button
          size={'small'}
          style={{marginBottom: '5px'}}
          onClick={this.refresh}
          variant={'contained'}
          color={'secondary'}
        >
          <RefreshIcon className={this.props.classes.leftIcon}/>
          Refresh
        </Button>
        {this.props.games.map((game, index) => (
          <Card
            style={
              this.props.game &&
              this.props.game.name === game.name ?
                {filter: 'brightness(90%)'}
                :
                {}
            }
            key={index}
            className='card'
          >
            <CardHeader
              title={game.name}
              subheader={`Host: ${game.owner.name}`}
            />
            <CardActions>
              {
                this.props.game && this.props.game.name === game.name ?
                  <Button onClick={() => {
                    this.props.api.game.leaveGame().then(this.refresh);
                  }}>Leave</Button> :
                  <Button onClick={() => {
                    this.props.api.game.joinGame(game.name);
                  }}>Join</Button>
              }
            </CardActions>
          </Card>
        ))}
        {
          this.props.games.length === 0 &&
          <div className='center'>
            <span>
              There are no open games to join
            </span>
          </div>
        }
      </div>
    );
  }
}

const ContextLinkedGameList = ApiContextWrapper(GameList);

const StyledGameList = withStyles(styles)(ContextLinkedGameList);

const mapStateToProps = ({game, games}: any) => ({
  game,
  games
});

export default connect(mapStateToProps)(StyledGameList);
