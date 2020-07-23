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
import {
  CheckDoesUserLikeCardpackRequest,
  LikeCardpackRequest,
  UnlikeCardpackRequest
} from '../../../../proto-gen-out/api/cardpack_service_pb';
import {Cardpack} from '../../../../proto-gen-out/api/model_pb';
import {
  checkDoesUserLikeCardpack,
  deleteCardpack,
  likeCardpack,
  unlikeCardpack
} from '../api/cardpackService';
import {convertTime} from '../helpers/time';
import {StoreState} from '../store';
import {showStatusMessage} from '../store/modules/global';

interface CardpackCardProps {
  cardpack: Cardpack;
  onDelete?(cardpackName: string): void;
}

const CardpackCard = (props: CardpackCardProps) => {
  const {currentUser} = useSelector(
    ({global: {user}}: StoreState) => ({currentUser: user})
  );
  const dispatch = useDispatch();
  const cardpackBelongsToCurrentUser = currentUser &&
    props.cardpack.getName().startsWith(currentUser.getName());
  const [isLiked, setIsLiked] = useState(false);
  const [loadingIsLiked, setLoadingIsLiked] =
    useState(currentUser && !cardpackBelongsToCurrentUser);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentUser && !cardpackBelongsToCurrentUser) {
      const request = new CheckDoesUserLikeCardpackRequest();
      request.setUserName(currentUser.getName());
      request.setCardpackName(props.cardpack.getName());
      checkDoesUserLikeCardpack(request)
        .then((response) => {
          setIsLiked(response.getIsLiked());
          setLoadingIsLiked(false);
        });
    }
  }, []);

  const toggleLike = async () => {
    if (currentUser && !loadingIsLiked) {
      setLoadingIsLiked(true);
      if (isLiked) {
        const request = new UnlikeCardpackRequest();
        request.setUserName(currentUser.getName());
        request.setCardpackName(props.cardpack.getName());
        await unlikeCardpack(request);
        setIsLiked(false);
      } else {
        const request = new LikeCardpackRequest();
        request.setUserName(currentUser.getName());
        request.setCardpackName(props.cardpack.getName());
        await likeCardpack(request);
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

  const deleteCardpackAction = () => {
    setIsDeleting(true);
    deleteCardpack(props.cardpack.getName())
        .then(() => {
          setIsDeleting(false);
          closeDeleteDialog();
          if (props.onDelete) {
            props.onDelete(props.cardpack.getName());
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
          title={props.cardpack.getDisplayName()}
          subheader={`Created ${convertTime(props.cardpack.getCreateTime())}`}
        />
        <CardActions>
          <NavLink to={`/${props.cardpack.getName()}`} style={{textDecoration: 'none'}}>
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
              currentUser && !cardpackBelongsToCurrentUser &&
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
              <Button
                variant={'outlined'}
                disabled={true}
              >
                Yes
              </Button>
              <Button
                variant={'contained'}
                color={'primary'}
                disabled={true}
              >
                No
              </Button>
            </DialogActions>
          </Dialog> :
          <Dialog open={showDeleteDialog} onClose={closeDeleteDialog}>
            <DialogTitle>Delete Cardpack</DialogTitle>
            <DialogContent>This is irreversible, are you sure?</DialogContent>
            <DialogActions>
              <Button
                variant={'outlined'}
                onClick={deleteCardpackAction}
              >
                Yes
              </Button>
              <Button
                variant={'contained'}
                color={'primary'}
                onClick={closeDeleteDialog}
              >
                No
              </Button>
            </DialogActions>
          </Dialog>
      }
    </div>
  );
};

export default CardpackCard;
