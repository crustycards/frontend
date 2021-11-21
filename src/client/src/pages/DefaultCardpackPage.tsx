import {
  CircularProgress,
  LinearProgress,
  Tab,
  Tabs,
  Theme,
  ImageList,
  ImageListItem,
  Typography
} from '@mui/material';
import {createStyles, makeStyles} from '@material-ui/styles';
import * as React from 'react';
import {useState, useEffect} from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import SwipeableViews from 'react-swipeable-views';
import {
  ListDefaultBlackCardsRequest,
  ListDefaultWhiteCardsRequest
} from '../../../../proto-gen-out/crusty_cards_api/cardpack_service_pb';
import {
  DefaultBlackCard,
  DefaultCardpack,
  DefaultWhiteCard
} from '../../../../proto-gen-out/crusty_cards_api/model_pb';
import {
  getDefaultCardpack,
  listDefaultBlackCards,
  listDefaultWhiteCards
} from '../api/cardpackService';
import CAHDefaultBlackCard from '../components/shells/CAHDefaultBlackCard';
import CAHDefaultWhiteCard from '../components/shells/CAHDefaultWhiteCard';
import ResourceNotFound from '../components/ResourceNotFound';
import {RouteComponentProps} from 'react-router';
import {useGlobalStyles} from '../styles/globalStyles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardList: {
      height: '200px',
      overflowX: 'hidden',
      overflowY: 'scroll'
    }
  })
);

const DefaultCardpackPage =
(props: RouteComponentProps<{cardpack: string}>) => {
  const defaultCardpackName = `defaultCardpacks/${props.match.params.cardpack}`;

  const [
    defaultCardpack,
    setDefaultCardpack
  ] = useState<DefaultCardpack | null | undefined>(undefined);

  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  const [
    defaultBlackCards,
    setDefaultBlackCards
  ] = useState<DefaultBlackCard[] | undefined>([]);
  const [nextBlackCardPageToken, setNextBlackCardPageToken] = useState('');
  const [hasMoreBlackCards, setHasMoreBlackCards] = useState(true);
  const [isLoadingBlackCards, setIsLoadingBlackCards] = useState(false);

  const [
    defaultWhiteCards,
    setDefaultWhiteCards
  ] = useState<DefaultWhiteCard[] | undefined>([]);
  const [nextWhiteCardPageToken, setNextWhiteCardPageToken] = useState('');
  const [hasMoreWhiteCards, setHasMoreWhiteCards] = useState(true);
  const [isLoadingWhiteCards, setIsLoadingWhiteCards] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);

  const fetchCurrentCardpack = async () => {
    await getDefaultCardpack(defaultCardpackName)
      .then((defaultCardpack) => {
        setDefaultCardpack(defaultCardpack);
      })
      .catch(() => {
        setDefaultCardpack(null);
      });
  }

  const handleTabChange = (_: any, value: number) => {
    setSlideIndex(value);
  };

  useEffect(() => {
    fetchCurrentCardpack();
  }, []);

  if (defaultCardpack === null) {
    return <ResourceNotFound resourceType={'Default Cardpack'}/>;
  }

  if (defaultCardpack === undefined) {
    return <LinearProgress/>;
  }

  return (
    <div className={globalClasses.contentWrap}>
      <div className={globalClasses.panel}>
        <div>
          <Typography align={'center'}>
            {defaultCardpack.getDisplayName()}
          </Typography>
          <div>
            <Tabs
              onChange={handleTabChange}
              value={slideIndex}
            >
              <Tab label={<Typography>{'White Cards'}</Typography>}/>
              <Tab label={<Typography>{'Black Cards'}</Typography>}/>
            </Tabs>
            <SwipeableViews
              onChangeIndex={handleTabChange}
              index={slideIndex}
            >
              <div>
                {
                  defaultWhiteCards === undefined ?
                    <div>Failed to load cards!</div> :
                    <div className={classes.cardList}>
                      <InfiniteScroll
                        useWindow={false}
                        loadMore={async () => {
                          if (!isLoadingWhiteCards) {
                            const request = new ListDefaultWhiteCardsRequest();
                            request.setPageToken(nextWhiteCardPageToken);
                            request.setPageSize(10);
                            request.setParent(defaultCardpack.getName());
                            setIsLoadingWhiteCards(true);
                            try {
                              const response =
                                await listDefaultWhiteCards(request);
                              const nextPageToken = response.getNextPageToken();
                              setNextWhiteCardPageToken(nextPageToken);
                              if (nextPageToken.length === 0) {
                                setHasMoreWhiteCards(false);
                              }
                              setDefaultWhiteCards([
                                ...defaultWhiteCards,
                                ...response.getDefaultWhiteCardsList()
                              ]);
                            } catch (err) {
                              setDefaultWhiteCards(undefined);
                            } finally {
                              setIsLoadingWhiteCards(false);
                            }
                          }
                        }}
                        loader={<CircularProgress/>}
                        hasMore={hasMoreWhiteCards}
                      >
                        {
                          <ImageList cols={4}>
                            {defaultWhiteCards.map((c, i) => (
                              <ImageListItem style={{height: 'auto'}} key={i}>
                                <CAHDefaultWhiteCard card={c}/>
                              </ImageListItem>
                            ))}
                          </ImageList>
                        }
                      </InfiniteScroll>
                    </div>
                }
              </div>
              <div>
                {
                  defaultBlackCards === undefined ?
                    <div>Failed to load cards!</div> :
                    <div className={classes.cardList}>
                      <InfiniteScroll
                        useWindow={false}
                        loadMore={async () => {
                          if (!isLoadingBlackCards) {
                            const request = new ListDefaultBlackCardsRequest();
                            request.setPageToken(nextBlackCardPageToken);
                            request.setPageSize(10);
                            request.setParent(defaultCardpack.getName());
                            setIsLoadingBlackCards(true);
                            try {
                              const response =
                                await listDefaultBlackCards(request);
                              const nextPageToken = response.getNextPageToken();
                              setNextBlackCardPageToken(nextPageToken);
                              if (nextPageToken.length === 0) {
                                setHasMoreBlackCards(false);
                              }
                              setDefaultBlackCards([
                                ...defaultBlackCards,
                                ...response.getDefaultBlackCardsList()
                              ]);
                            } catch (err) {
                              setDefaultBlackCards(undefined);
                            } finally {
                              setIsLoadingBlackCards(false);
                            }
                          }
                        }}
                        loader={<CircularProgress/>}
                        hasMore={hasMoreBlackCards}
                      >
                        {
                          <ImageList cols={4}>
                            {defaultBlackCards.map((c, i) => (
                              <ImageListItem style={{height: 'auto'}} key={i}>
                                <CAHDefaultBlackCard card={c}/>
                              </ImageListItem>
                            ))}
                          </ImageList>
                        }
                      </InfiniteScroll>
                    </div>
                }
              </div>
            </SwipeableViews>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultCardpackPage;
