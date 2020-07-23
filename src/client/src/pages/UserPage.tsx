import {CircularProgress, Fab, Grid, Typography} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ListCardpacksRequest} from '../../../../proto-gen-out/api/cardpack_service_pb';
import {Cardpack, User} from '../../../../proto-gen-out/api/model_pb';
import {useUserService} from '../api/context';
import CardpackCreator from '../components/CardpackCreator';
import ProfileEditorDialog from '../components/ProfileEditorDialog';
import UrlImage from '../components/UrlImage';
import {StoreState} from '../store';
import * as InfiniteScroll from 'react-infinite-scroller';
import {listCardpacks} from '../api/cardpackService';
import CardpackCard from '../components/CardpackCard';
import {useGlobalStyles} from '../styles/globalStyles';
import {RouteComponentProps} from 'react-router';

const UserPage = (props: RouteComponentProps<{user: string}>) => {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoadingCardpacks, setIsLoadingCardpacks] = useState(false);
  const [cardpacks, setCardpacks] = useState<Cardpack[] | undefined>([]);
  const [nextCardpackPageToken, setNextCardpackPageToken] = useState('');
  const [hasMoreCardpacks, setHasMoreCardpacks] = useState(true);
  const [showProfileEditorDialog, setShowProfileEditorDialog] = useState(false);

  const {currentUser} = useSelector(
    ({global: {user}}: StoreState) => ({currentUser: user})
  );

  const globalClasses = useGlobalStyles();

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
        <h1>Loading User Page</h1>
        <CircularProgress size={100}/>
      </div>
    );
  }

  if (user === undefined) {
    return (<h1>User Not Found</h1>);
  }

  return (
    <div className={globalClasses.contentWrap}>
      <div className={globalClasses.panel}>
        <Grid container spacing={8}>
          <Grid item xs={12} md={5}>
            <UrlImage
              url={userService.getUserProfileImageUrl(user.getName())}
              loadingView={<CircularProgress/>}
              errorView={<div>No profile image</div>}
              imageStyle={{
                height: '150px',
                width: '150px',
                borderRadius: '5px'
              }}
            />
            <Typography
              variant={'h5'}
            >
              {user.getDisplayName()}
            </Typography>
            {
              currentUser && isCurrentUser &&
                <div>
                  <Fab
                    color={'secondary'}
                    aria-label={'Edit'}
                    onClick={() => setShowProfileEditorDialog(true)}
                  >
                    <EditIcon/>
                  </Fab>
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
                <CardpackCreator
                  user={currentUser}
                  onSubmit={(cardpack) => {
                    if (cardpacks !== undefined) {
                      setCardpacks([...cardpacks, cardpack]);
                    }
                  }}
                />
            }
            {
              cardpacks === undefined ?
                <div>Failed to load cardpacks!</div> :
                <InfiniteScroll
                  loadMore={async () => {
                    if (!isLoadingCardpacks) {
                      const request = new ListCardpacksRequest();
                      request.setPageToken(nextCardpackPageToken);
                      request.setPageSize(5);
                      request.setParent(user.getName());
                      setIsLoadingCardpacks(true);
                      try {
                        const response = await listCardpacks(request);
                        const nextPageToken = response.getNextPageToken();
                        setNextCardpackPageToken(nextPageToken);
                        if (nextPageToken.length === 0) {
                          setHasMoreCardpacks(false);
                        }
                        setCardpacks([
                          ...cardpacks,
                          ...response.getCardpacksList()
                        ]);
                      } catch (err) {
                        setCardpacks(undefined);
                      } finally {
                        setIsLoadingCardpacks(false);
                      }
                    }
                  }}
                  loader={<CircularProgress/>}
                  hasMore={hasMoreCardpacks}
                >
                  {cardpacks.map((cardpack, index) => {
                    return <CardpackCard cardpack={cardpack} key={index}/>;
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
