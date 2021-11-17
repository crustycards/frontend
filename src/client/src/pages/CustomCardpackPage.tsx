import {
  CircularProgress,
  LinearProgress,
  Tab,
  Tabs,
  Theme,
  GridList,
  GridListTile,
  Typography
} from '@mui/material';
import {createStyles, makeStyles} from '@material-ui/styles';
import * as React from 'react';
import {useState, useEffect} from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import SwipeableViews from 'react-swipeable-views';
import {
  ListCustomBlackCardsRequest,
  ListCustomWhiteCardsRequest
} from '../../../../proto-gen-out/crusty_cards_api/cardpack_service_pb';
import {CustomBlackCard, CustomCardpack, CustomWhiteCard} from '../../../../proto-gen-out/crusty_cards_api/model_pb';
import {
  getCustomCardpack,
  listCustomBlackCards,
  listCustomWhiteCards,
  createCustomWhiteCard,
  createCustomBlackCard
} from '../api/cardpackService';
import BlackCardAdder from './CustomCardpackPage/BlackCardAdder';
import WhiteCardAdder from './CustomCardpackPage/WhiteCardAdder';
import CAHCustomBlackCard from '../components/shells/CAHCustomBlackCard';
import CAHCustomWhiteCard from '../components/shells/CAHCustomWhiteCard';
import {useGlobalStyles} from '../styles/globalStyles';
import ResourceNotFound from '../components/ResourceNotFound';
import {RouteComponentProps} from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardList: {
      height: '200px',
      overflowX: 'hidden',
      overflowY: 'scroll'
    }
  })
);

const CustomCardpackPage =
(props: RouteComponentProps<{user: string, cardpack: string}>) => {
  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const customCardpackName = `users/${props.match.params.user}/cardpacks/${props.match.params.cardpack}`;

  const [
    customCardpack,
    setCustomCardpack
  ] = useState<CustomCardpack | null | undefined>(undefined);


  const [
    customBlackCards,
    setCustomBlackCards
  ] = useState<CustomBlackCard[] | undefined>([]);
  const [nextBlackCardPageToken, setNextBlackCardPageToken] = useState('');
  const [hasMoreBlackCards, setHasMoreBlackCards] = useState(true);
  const [isLoadingBlackCards, setIsLoadingBlackCards] = useState(false);

  const [
    customWhiteCards,
    setCustomWhiteCards
  ] = useState<CustomWhiteCard[] | undefined>([]);
  const [nextWhiteCardPageToken, setNextWhiteCardPageToken] = useState('');
  const [hasMoreWhiteCards, setHasMoreWhiteCards] = useState(true);
  const [isLoadingWhiteCards, setIsLoadingWhiteCards] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);

  const fetchCurrentCardpack = async () => {
    await getCustomCardpack(customCardpackName)
      .then((customCardpack) => {
        setCustomCardpack(customCardpack);
      })
      .catch(() => {
        setCustomCardpack(null);
      });
  }

  const addCustomBlackCard = (card: CustomBlackCard) => {
    createCustomBlackCard(customCardpackName, card).then((createdCard) => {
      // TODO - Add this card to the component state.
    });
  }

  const addCustomWhiteCard = (card: CustomWhiteCard) => {
    createCustomWhiteCard(customCardpackName, card).then((createdCard) => {
      // TODO - Add this card to the component state.
    });
  }

  const handleTabChange = (_: any, value: number) => {
    setSlideIndex(value);
  };

  useEffect(() => {
    fetchCurrentCardpack();
  }, []);

  if (customCardpack === null) {
    return <ResourceNotFound resourceType={'Custom Cardpack'}/>;
  }

  if (customCardpack === undefined) {
    return <LinearProgress/>;
  }

  return (
    <div className={globalClasses.contentWrap}>
      <div className={globalClasses.panel}>
        <div>
          <Typography align={'center'}>
            {customCardpack.getDisplayName()}
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
                <WhiteCardAdder addCard={(card) => addCustomWhiteCard(card)}/>
                {
                  customWhiteCards === undefined ?
                    <div>Failed to load cards!</div> :
                    <div className={classes.cardList}>
                      <InfiniteScroll
                        useWindow={false}
                        loadMore={async () => {
                          if (!isLoadingWhiteCards) {
                            const request = new ListCustomWhiteCardsRequest();
                            request.setPageToken(nextWhiteCardPageToken);
                            request.setPageSize(10);
                            request.setParent(customCardpack.getName());
                            setIsLoadingWhiteCards(true);
                            try {
                              const response =
                                await listCustomWhiteCards(request);
                              const nextPageToken = response.getNextPageToken();
                              setNextWhiteCardPageToken(nextPageToken);
                              if (nextPageToken.length === 0) {
                                setHasMoreWhiteCards(false);
                              }
                              setCustomWhiteCards([
                                ...customWhiteCards,
                                ...response.getCustomWhiteCardsList()
                              ]);
                            } catch (err) {
                              setCustomWhiteCards(undefined);
                            } finally {
                              setIsLoadingWhiteCards(false);
                            }
                          }
                        }}
                        loader={<CircularProgress/>}
                        hasMore={hasMoreWhiteCards}
                      >
                        {
                          <GridList cols={4}>
                            {customWhiteCards.map((c, i) => (
                              <GridListTile style={{height: 'auto'}} key={i}>
                                <CAHCustomWhiteCard card={c}/>
                              </GridListTile>
                            ))}
                          </GridList>
                        }
                      </InfiniteScroll>
                    </div>
                }
              </div>
              <div>
                <BlackCardAdder addCard={(card) => addCustomBlackCard(card)}/>
                {
                  customBlackCards === undefined ?
                    <div>Failed to load cards!</div> :
                    <div className={classes.cardList}>
                      <InfiniteScroll
                        useWindow={false}
                        loadMore={async () => {
                          if (!isLoadingBlackCards) {
                            const request = new ListCustomBlackCardsRequest();
                            request.setPageToken(nextBlackCardPageToken);
                            request.setPageSize(10);
                            request.setParent(customCardpack.getName());
                            setIsLoadingBlackCards(true);
                            try {
                              const response =
                                await listCustomBlackCards(request);
                              const nextPageToken = response.getNextPageToken();
                              setNextBlackCardPageToken(nextPageToken);
                              if (nextPageToken.length === 0) {
                                setHasMoreBlackCards(false);
                              }
                              setCustomBlackCards([
                                ...customBlackCards,
                                ...response.getCustomBlackCardsList()
                              ]);
                            } catch (err) {
                              setCustomBlackCards(undefined);
                            } finally {
                              setIsLoadingBlackCards(false);
                            }
                          }
                        }}
                        loader={<CircularProgress/>}
                        hasMore={hasMoreBlackCards}
                      >
                        {
                          <GridList cols={4}>
                            {customBlackCards.map((c, i) => (
                              <GridListTile style={{height: 'auto'}} key={i}>
                                <CAHCustomBlackCard card={c}/>
                              </GridListTile>
                            ))}
                          </GridList>
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

export default CustomCardpackPage;
