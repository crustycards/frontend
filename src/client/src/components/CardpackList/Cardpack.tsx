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
  IconButton
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {useApi} from '../../api/context';
import {Cardpack as CardpackModel} from '../../api/dao';
import {convertTime} from '../../helpers/time';
import {StoreState} from '../../store';
import {showStatusMessage} from '../../store/modules/global';

interface CardpackProps {
  cardpack: CardpackModel;
  onDelete?(cardpackId: string): void;
}

const Cardpack = (props: CardpackProps) => {
  const {currentUser} = useSelector(({global: {user}}: StoreState) => ({currentUser: user}));
  const dispatch = useDispatch();
  const cardpackBelongsToCurrentUser = currentUser.id === props.cardpack.owner.id;
  const [isLiked, setIsLiked] = useState(false);
  const [loadingIsLiked, setLoadingIsLiked] = useState(!cardpackBelongsToCurrentUser);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const api = useApi();

  useEffect(() => {
    if (!cardpackBelongsToCurrentUser) {
      api.main.cardpackIsFavorited(props.cardpack.id)
        .then((isLiked) => {
          setIsLiked(isLiked);
          setLoadingIsLiked(false);
        });
    }
  }, []);

  const toggleLike = async () => {
    if (!loadingIsLiked) {
      setLoadingIsLiked(true);
      if (isLiked) {
        await api.main.unfavoriteCardpack(props.cardpack.id);
        setIsLiked(false);
      } else {
        await api.main.favoriteCardpack(props.cardpack.id);
        setIsLiked(true);
      }
      setLoadingIsLiked(false);
    }
  };

  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const deleteCardpack = () => {
    setIsDeleting(true);
    api.main.deleteCardpack(props.cardpack.id)
        .then(() => {
          setIsDeleting(false);
          closeDeleteDialog();
          if (props.onDelete) {
            props.onDelete(props.cardpack.id);
          }
        })
        .catch(() => {
          setIsDeleting(false);
          closeDeleteDialog();
          dispatch(showStatusMessage('Error occured deleting cardpack'));
        });
  };

  return (
    <div>
      <Card className='card'>
        <CardHeader
          title={props.cardpack.name}
          subheader={`Created ${convertTime(props.cardpack.createdAt)}`}
        />
        <CardActions>
          <NavLink to={`/cardpack?id=${props.cardpack.id}`} style={{textDecoration: 'none'}}>
            <Button>
              View
            </Button>
          </NavLink>
          {
            cardpackBelongsToCurrentUser &&
            <Button onClick={openDeleteDialog}>
              Delete
            </Button>
          }
          <div style={{
            position: 'relative'
          }}>
            {
              !cardpackBelongsToCurrentUser &&
              <IconButton
                onClick={toggleLike}
                style={{
                  color: isLiked ? '#d12743' : undefined,
                  transition: 'all .15s ease-in'
                }}
              >
                <FavoriteIcon/>
              </IconButton>
            }
            {
              loadingIsLiked &&
              <CircularProgress size={36} style={{
                position: 'absolute',
                top: 5,
                left: 6,
                zIndex: 1
              }}/>
            }
          </div>
        </CardActions>
      </Card>
      {
          isDeleting ?
            <Dialog open={showDeleteDialog} onClose={closeDeleteDialog}>
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
            <Dialog open={showDeleteDialog} onClose={closeDeleteDialog}>
              <DialogTitle>Delete Cardpack</DialogTitle>
              <DialogContent>This is irreversible, are you sure?</DialogContent>
              <DialogActions>
                <Button variant={'outlined'} onClick={deleteCardpack}>Yes</Button>
                <Button variant={'contained'} color={'primary'} onClick={closeDeleteDialog}>No</Button>
              </DialogActions>
            </Dialog>
      }
    </div>
  );
};

export default Cardpack;
