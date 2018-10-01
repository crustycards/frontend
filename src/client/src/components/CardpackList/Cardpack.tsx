import {Button, Card, CardActions, CardHeader, CircularProgress, IconButton} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {ApiContextWrapper} from '../../api/context';
import { Cardpack as CardpackModel, User } from '../../api/dao';
import Api from '../../api/model/api';
import {convertTime} from '../../helpers/time';

const navItemStyle = {textDecoration: 'none'};

interface CardpackProps {
  api: Api;
  cardpack: CardpackModel;
  canDelete: boolean;
  currentUser: User;
}

interface CardpackState {
  isLiked: boolean;
}

class Cardpack extends Component<CardpackProps, CardpackState> {
  constructor(props: CardpackProps) {
    super(props);

    this.toggleLike = this.toggleLike.bind(this);

    this.state = {
      isLiked: this.props.currentUser.id === this.props.cardpack.owner.id ? undefined : null
    };

    if (this.state.isLiked === null) {
      this.props.api.main.cardpackIsFavorited(this.props.cardpack.id)
        .then((isLiked) => {
          this.setState({isLiked});
        });
    }
  }

  public async toggleLike() {
    if (this.state.isLiked) {
      await this.props.api.main.unfavoriteCardpack(this.props.cardpack.id);
      this.setState({isLiked: false});
    } else {
      await this.props.api.main.favoriteCardpack(this.props.cardpack.id);
      this.setState({isLiked: true});
    }
  }

  public render() {
    return (
      <Card className='card'>
        <CardHeader
          title={this.props.cardpack.name}
          subheader={`Created ${convertTime(this.props.cardpack.createdAt)}`}
        />
        <CardActions>
          <NavLink to={`/cardpack?id=${this.props.cardpack.id}`} style={navItemStyle}>
            <Button>
              View
            </Button>
          </NavLink>
          {
            this.props.canDelete &&
            <Button onClick={() => this.props.api.main.deleteCardpack(this.props.cardpack.id)}>
              Delete
            </Button>
          }
          {
            (this.state.isLiked === true || this.state.isLiked === false) &&
            <IconButton onClick={this.toggleLike} style={{color: this.state.isLiked ? '#d12743' : undefined, transition: 'all .2s ease-in'}}>
              <FavoriteIcon />
            </IconButton>
          }
          {
            this.state.isLiked === null &&
            <CircularProgress/>
          }
        </CardActions>
      </Card>
    );
  }
}

const mapStateToProps = ({global: {user}}: any) => ({
  currentUser: user
});

export default connect(mapStateToProps)(ApiContextWrapper(Cardpack));
