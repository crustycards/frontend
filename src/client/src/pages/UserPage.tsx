import {CircularProgress, Fab, Grid, Typography, Avatar, Badge, Theme} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ListCustomCardpacksRequest} from '../../../../proto-gen-out/api/cardpack_service_pb';
import {CustomCardpack, User} from '../../../../proto-gen-out/api/model_pb';
import {useUserService} from '../api/context';
import CustomCardpackCreator from '../components/CustomCardpackCreator';
import ProfileEditorDialog from '../components/ProfileEditorDialog';
import {StoreState} from '../store';
import * as InfiniteScroll from 'react-infinite-scroller';
import {listCustomCardpacks} from '../api/cardpackService';
import CAHCustomCardpack from '../components/shells/CAHCustomCardpack';
import {useGlobalStyles} from '../styles/globalStyles';
import {RouteComponentProps} from 'react-router';
import ResourceNotFound from '../components/ResourceNotFound';

const useStyles = makeStyles((theme: Theme) => ({
  profileImage: {
    width: theme.spacing(15),
    height: theme.spacing(15)
  }
}));

const UserPage = (props: RouteComponentProps<{user: string}>) => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [
    isLoadingCustomCardpacks,
    setIsLoadingCustomCardpacks
  ] = useState(false);
  const [
    customCardpacks,
    setCustomCardpacks
  ] = useState<CustomCardpack[] | undefined>([]);
  const [
    nextCustomCardpackPageToken,
    setNextCustomCardpackPageToken
  ] = useState('');
  const [hasMoreCustomCardpacks, setHasMoreCustomCardpacks] = useState(true);
  const [showProfileEditorDialog, setShowProfileEditorDialog] = useState(false);

  const {currentUser} = useSelector(
    ({global: {user}}: StoreState) => ({currentUser: user})
  );

  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  const userService = useUserService();

  const userName = `users/${props.match.params.user}`;
  const isCurrentUser = currentUser?.getName() === userName;

  useEffect(() => {
    if (typeof userName === 'string') {
      userService.getUser(userName)
          .then((user) => {
            setUser(user);
          })
          .finally(() => {
            setIsLoadingUser(false);
          });
    } else {
      setIsLoadingUser(false);
    }
  }, []);

  if (isLoadingUser) {
    return (
      <div style={{
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        margin: 0,
        transform: 'translate(-50%, -50%)'
      }}>
        <Typography
          variant={'h3'}
        >
          Loading User Page
        </Typography>
        <CircularProgress size={100}/>
      </div>
    );
  }

  if (user === undefined) {
    return <ResourceNotFound resourceType={'User'}/>;
  }

  return (
    <div className={globalClasses.contentWrap}>
      <div className={globalClasses.panel}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={5}>
            <Badge
              overlap={'circle'}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              badgeContent={
                currentUser && isCurrentUser &&
                  <Fab
                    size={'small'}
                    color={'secondary'}
                    onClick={() => setShowProfileEditorDialog(true)}
                  >
                    <EditIcon/>
                  </Fab>
              }
            >
              <Avatar
                src={userService.getUserProfileImageUrl(user.getName())}
                className={classes.profileImage}
              />
            </Badge>
            <Typography
              variant={'h5'}
            >
              {user.getDisplayName()}
            </Typography>
            {
              currentUser && isCurrentUser &&
                <div>
                  <ProfileEditorDialog
                    currentUser={currentUser}
                    isVisible={showProfileEditorDialog}
                    onClose={() => setShowProfileEditorDialog(false)}
                    onDisplayNameChange={(displayName) => {
                      const newUser = user.clone();
                      newUser.setDisplayName(displayName);
                      setUser(newUser);
                      setShowProfileEditorDialog(false);
                    }}
                  />
                </div>
            }
          </Grid>
          <Grid item xs={12} md={7}>
            {
              currentUser && isCurrentUser &&
                <CustomCardpackCreator
                  user={currentUser}
                  onSubmit={(customCardpack) => {
                    if (customCardpacks !== undefined) {
                      setCustomCardpacks([...customCardpacks, customCardpack]);
                    }
                  }}
                />
            }
            {
              customCardpacks === undefined ?
                <div>Failed to load cardpacks!</div> :
                <InfiniteScroll
                  loadMore={async () => {
                    if (!isLoadingCustomCardpacks) {
                      const request = new ListCustomCardpacksRequest();
                      request.setPageToken(nextCustomCardpackPageToken);
                      request.setPageSize(5);
                      request.setParent(user.getName());
                      setIsLoadingCustomCardpacks(true);
                      try {
                        const response = await listCustomCardpacks(request);
                        const nextPageToken = response.getNextPageToken();
                        setNextCustomCardpackPageToken(nextPageToken);
                        if (nextPageToken.length === 0) {
                          setHasMoreCustomCardpacks(false);
                        }
                        setCustomCardpacks([
                          ...customCardpacks,
                          ...response.getCustomCardpacksList()
                        ]);
                      } catch (err) {
                        setCustomCardpacks(undefined);
                      } finally {
                        setIsLoadingCustomCardpacks(false);
                      }
                    }
                  }}
                  loader={<CircularProgress/>}
                  hasMore={hasMoreCustomCardpacks}
                >
                  {customCardpacks.map((customCardpack, index) => {
                    return (
                      <CAHCustomCardpack
                        customCardpack={customCardpack}
                        key={index}
                      />
                    );
                  })}
                </InfiniteScroll>
            }
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default UserPage;
