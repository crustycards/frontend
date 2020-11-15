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
  CheckDoesUserLikeCustomCardpackRequest,
  LikeCustomCardpackRequest,
  UnlikeCustomCardpackRequest
} from '../../../../../proto-gen-out/api/cardpack_service_pb';
import {CustomCardpack} from '../../../../../proto-gen-out/api/model_pb';
import {
  checkDoesUserLikeCustomCardpack,
  deleteCustomCardpack,
  likeCustomCardpack,
  unlikeCustomCardpack
} from '../../api/cardpackService';
import {convertTime} from '../../helpers/time';
import {StoreState} from '../../store';
import {showStatusMessage} from '../../store/modules/global';
import {useGlobalStyles} from '../../styles/globalStyles';

interface CAHCustomCardpackProps {
  customCardpack: CustomCardpack;
  onDelete?(cardpack: string): void;
}

const CAHCustomCardpack = (props: CAHCustomCardpackProps) => {
  const {currentUser} = useSelector(
    ({global: {user}}: StoreState) => ({currentUser: user})
  );
  const dispatch = useDispatch();
  const packBelongsToCurrentUser = currentUser &&
    props.customCardpack.getName().startsWith(currentUser.getName());
  const [isLiked, setIsLiked] = useState(false);
  const [loadingIsLiked, setLoadingIsLiked] =
    useState(currentUser && !packBelongsToCurrentUser);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const globalClasses = useGlobalStyles();

  useEffect(() => {
    if (currentUser && !packBelongsToCurrentUser) {
      const request = new CheckDoesUserLikeCustomCardpackRequest();
      request.setUser(currentUser.getName());
      request.setCustomCardpack(props.customCardpack.getName());
      checkDoesUserLikeCustomCardpack(request)
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
        const request = new UnlikeCustomCardpackRequest();
        request.setUser(currentUser.getName());
        request.setCustomCardpack(props.customCardpack.getName());
        await unlikeCustomCardpack(request);
        setIsLiked(false);
      } else {
        const request = new LikeCustomCardpackRequest();
        request.setUser(currentUser.getName());
        request.setCustomCardpack(props.customCardpack.getName());
        await likeCustomCardpack(request);
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

  const deleteCustomCardpackAction = () => {
    setIsDeleting(true);
    deleteCustomCardpack(props.customCardpack.getName())
        .then(() => {
          setIsDeleting(false);
          closeDeleteDialog();
          if (props.onDelete) {
            props.onDelete(props.customCardpack.getName());
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
      <Card className={globalClasses.card}>
        <CardHeader
          title={props.customCardpack.getDisplayName()}
          subheader={`Created ${convertTime(props.customCardpack.getCreateTime())}`}
        />
        <CardActions>
          <NavLink
            to={`/${props.customCardpack.getName()}`}
            style={{textDecoration: 'none'}}
          >
            <Button>
              View
            </Button>
          </NavLink>
          {
            packBelongsToCurrentUser &&
              <Button onClick={openDeleteDialog}>
                Delete
              </Button>
          }
          <div style={{
            position: 'relative'
          }}>
            {
              currentUser && !packBelongsToCurrentUser &&
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
                onClick={deleteCustomCardpackAction}
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

export default CAHCustomCardpack;
