import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {bindActionCreators, Dispatch} from 'redux';
import {ApiContextWrapper} from '../../api/context';
import {Cardpack as CardpackModel, User} from '../../api/dao';
import Api from '../../api/model/api';
import {convertTime} from '../../helpers/time';
import {showStatusMessage} from '../../store/modules/global';

const navItemStyle = {textDecoration: 'none'};

const styles = (theme: Theme) => ({
});

interface CardpackProps extends WithStyles<typeof styles> {
  api: Api;
  cardpack: CardpackModel;
  canDelete: boolean;
  currentUser: User;
  showStatusMessage(msg: string): void;
  onDelete?(cardpackId: string): void;
}

interface CardpackState {
  isLiked: boolean;
  showDeleteDialog: boolean;
  isDeleting: boolean;
}

class Cardpack extends Component<CardpackProps, CardpackState> {
  constructor(props: CardpackProps) {
    super(props);

    this.toggleLike = this.toggleLike.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.deleteCardpack = this.deleteCardpack.bind(this);

    this.state = {
      isLiked: this.props.currentUser.id === this.props.cardpack.owner.id ? undefined : null,
      showDeleteDialog: false,
      isDeleting: false
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

  public openDeleteDialog() {
    this.setState({showDeleteDialog: true});
  }

  public closeDeleteDialog() {
    this.setState({showDeleteDialog: false});
  }

  public deleteCardpack() {
    this.setState({isDeleting: true});
    this.props.api.main.deleteCardpack(this.props.cardpack.id)
        .then(() => {
          this.setState({isDeleting: false});
          this.closeDeleteDialog();
          if (this.props.onDelete) {
            this.props.onDelete(this.props.cardpack.id);
          }
        })
        .catch(() => {
          this.setState({isDeleting: false});
          this.closeDeleteDialog();
          this.props.showStatusMessage('Error occured deleting cardpack');
        });
  }

  public render() {
    return (
      <div>
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
              <Button onClick={this.openDeleteDialog}>
                Delete
              </Button>
            }
            {
              (this.state.isLiked === true || this.state.isLiked === false) &&
              <IconButton
                onClick={this.toggleLike}
                style={{
                  color: this.state.isLiked ? '#d12743' : undefined,
                  transition: 'all .2s ease-in'
                }}
              >
                <FavoriteIcon/>
              </IconButton>
            }
            {
              this.state.isLiked === null &&
              <CircularProgress/>
            }
          </CardActions>
        </Card>
        {
            this.state.isDeleting ?
              <Dialog open={this.state.showDeleteDialog} onClose={this.closeDeleteDialog}>
                <DialogTitle>Delete Cardpack</DialogTitle>
                <DialogContent>
                  <div style={{textAlign: 'center'}}>
                    <CircularProgress size={50}/>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button variant={'outlined'} disabled={true}>Yes</Button>
                  <Button variant={'contained'} color={'primary'} disabled={true}>No</Button>
                </DialogActions>
              </Dialog> :
              <Dialog open={this.state.showDeleteDialog} onClose={this.closeDeleteDialog}>
                <DialogTitle>Delete Cardpack</DialogTitle>
                <DialogContent>This is irreversible, are you sure?</DialogContent>
                <DialogActions>
                  <Button variant={'outlined'} onClick={this.deleteCardpack}>Yes</Button>
                  <Button variant={'contained'} color={'primary'} onClick={this.closeDeleteDialog}>No</Button>
                </DialogActions>
              </Dialog>
        }
      </div>
    );
  }
}

const StyledCardpack = withStyles(styles)(Cardpack);

const ApiWrappedCardpack = ApiContextWrapper(StyledCardpack);

const mapStateToProps = ({global: {user}}: any) => ({
  currentUser: user
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  showStatusMessage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ApiWrappedCardpack);
