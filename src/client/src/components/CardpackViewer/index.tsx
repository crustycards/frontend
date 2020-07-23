import {
  Button,
  CircularProgress,
  LinearProgress,
  Tab,
  Tabs,
  Theme,
  GridList,
  GridListTile
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {FileWithPath} from 'react-dropzone';
import * as InfiniteScroll from 'react-infinite-scroller';
import SwipeableViews from 'react-swipeable-views';
import {
  BatchCreateBlackCardsRequest,
  BatchCreateWhiteCardsRequest,
  CreateBlackCardRequest,
  CreateWhiteCardRequest,
  ListBlackCardsRequest,
  ListWhiteCardsRequest
} from '../../../../../proto-gen-out/api/cardpack_service_pb';
import {BlackCard, Cardpack, User, WhiteCard} from '../../../../../proto-gen-out/api/model_pb';
import {
  batchCreateBlackCards,
  batchCreateWhiteCards,
  getCardpack,
  listBlackCards,
  listWhiteCards,
  createWhiteCard,
  createBlackCard
} from '../../api/cardpackService';
import {
  parseFromJson,
  stringifyToJson
} from '../../helpers/cardpackFileHandler';
import FileUploaderDialog from '../FileUploaderDialog';
import BlackCardAdder from './BlackCardAdder';
import WhiteCardAdder from './WhiteCardAdder';
import CAHBlackCard from '../shells/CAHBlackCard';
import CAHWhiteCard from '../shells/CAHWhiteCard';
import {useGlobalStyles} from '../../styles/globalStyles';
import {useSelector} from 'react-redux';
import {StoreState} from '../../store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardList: {
      height: '200px',
      overflowX: 'hidden',
      overflowY: 'scroll'
    }
  })
);

interface CardpackViewerProps {
  cardpackName: string;
}

// TODO - Allow users to download cardpacks as either
// json or plaintext (and upload as either as well).

const CardpackViewer = (props: CardpackViewerProps) => {
  const {currentUser} = useSelector(
    ({global: {user}}: StoreState) => ({currentUser: user})
  );
  const [
    cardpack,
    setCardpack
  ] = useState<Cardpack | null | undefined>(undefined);

  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  const [blackCards, setBlackCards] = useState<BlackCard[] | undefined>([]);
  const [nextBlackCardPageToken, setNextBlackCardPageToken] = useState('');
  const [hasMoreBlackCards, setHasMoreBlackCards] = useState(true);
  const [isLoadingBlackCards, setIsLoadingBlackCards] = useState(false);

  const [whiteCards, setWhiteCards] = useState<WhiteCard[] | undefined>([]);
  const [nextWhiteCardPageToken, setNextWhiteCardPageToken] = useState('');
  const [hasMoreWhiteCards, setHasMoreWhiteCards] = useState(true);
  const [isLoadingWhiteCards, setIsLoadingWhiteCards] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialogBox, setShowUploadDialogBox] = useState(false);

  const convertFileToCardpackData = async (file: FileWithPath) => {
    const fileData = await new Promise<string | ArrayBuffer | null>
    ((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsText(file);
    });

    if (fileData === null) {
      throw new Error('Failed to parse cardpack data - File data is null');
    } else if (fileData instanceof ArrayBuffer) {
      // This should never happen since we're calling `readAsText()` on the
      // FileReader above. This is only here to make Typescript happy.
      throw new Error('Failed to parse cardpack data - Got ArrayBuffer instead of string');
    }
    return parseFromJson(fileData);
  };

  const openUploadDialog = () => {
    setShowUploadDialogBox(true);
  }

  const closeUploadDialog = () => {
    setShowUploadDialogBox(false);
  }

  const fetchCurrentCardpack = async () => {
    await getCardpack(props.cardpackName)
      .then((cardpack) => {
        setCardpack(cardpack);
      })
      .catch(() => {
        setCardpack(null);
      });
  }

  const addBlackCard = (card: BlackCard) => {
    createBlackCard(props.cardpackName, card).then((createdCard) => {
      // TODO - Add this card to the component state.
    });
  }

  const addBlackCards = (cards: BlackCard[]) => {
    const batchCreateBlackCardsRequest = new BatchCreateBlackCardsRequest();
    batchCreateBlackCardsRequest.setParent(props.cardpackName);
    cards.forEach((card) => {
      const createBlackCardRequest = new CreateBlackCardRequest();
      createBlackCardRequest.setBlackCard(card);
      batchCreateBlackCardsRequest.addRequests(createBlackCardRequest);
    });
    batchCreateBlackCards(batchCreateBlackCardsRequest).then((response) => {
      const createdCards = response.getBlackCardsList();
      // TODO - Add these cards to the component state.
    });
  }

  const addWhiteCard = (card: WhiteCard) => {
    createWhiteCard(props.cardpackName, card).then((createdCard) => {
      // TODO - Add this card to the component state.
    });
  }

  const addWhiteCards = (cards: WhiteCard[]) => {
    const batchCreateWhiteCardsRequest = new BatchCreateWhiteCardsRequest();
    batchCreateWhiteCardsRequest.setParent(props.cardpackName);
    cards.forEach((card) => {
      const createWhiteCardRequest = new CreateWhiteCardRequest();
      createWhiteCardRequest.setWhiteCard(card);
      batchCreateWhiteCardsRequest.addRequests(createWhiteCardRequest);
    });
    batchCreateWhiteCards(batchCreateWhiteCardsRequest).then((response) => {
      const createdCards = response.getWhiteCardsList();
      // TODO - Add these cards to the component state.
    });
  }

  const downloadStringifiedCards = () => {
    const download = (filename: string, text: string) => {
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
      );
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
    // Start file download.
    // TODO - Uncomment and fix this.
    // download(cardpack.name, stringifyToJson({
    //   whiteCards: cardpack.whiteCards,
    //   blackCards: cardpack.blackCards
    // }));
  }

  const handleUpload = async (
    acceptedFiles: FileWithPath[],
    rejectedFiles: FileWithPath[],
    event: React.DragEvent<HTMLDivElement>
  ) => {
    if (acceptedFiles.length === 1 && rejectedFiles.length === 0) {
      closeUploadDialog();
      const file = acceptedFiles[0];
      const {whiteCards, blackCards} = await convertFileToCardpackData(file);
      setIsUploading(true);
      await Promise.all([
        addWhiteCards(whiteCards),
        addBlackCards(blackCards)
      ]);
      setIsUploading(false);
    }
  };

  const handleTabChange = (_: any, value: number) => {
    setSlideIndex(value);
  };

  useEffect(() => {
    fetchCurrentCardpack();
  }, []);

  if (cardpack === null) {
    return <div className={globalClasses.panel}>Cardpack does not exist</div>;
  }

  if (cardpack === undefined) {
    return <LinearProgress/>;
  }

  const isOwner = currentUser
    && cardpack.getName().startsWith(currentUser.getName());

  return (
    <div className={globalClasses.panel}>
      <div>
        <div className='center'>{cardpack.getDisplayName()}</div>
          {cardpack &&
            <div>
              <Button
                style={{margin: '2px'}}
                variant={'outlined'}
                onClick={downloadStringifiedCards}
              >
                Download
              </Button>
              {
                isOwner &&
                <div style={{display: 'inline'}}>
                  <Button
                    style={{margin: '2px'}}
                    variant={'outlined'}
                    disabled={isUploading}
                    onClick={openUploadDialog}
                  >
                    Upload
                  </Button>
                  <FileUploaderDialog
                    titleText={'Upload cardpack *.txt file'}
                    type={'text/*'}
                    onUpload={handleUpload}
                    onClose={closeUploadDialog}
                    isVisible={showUploadDialogBox}
                  />
                </div>
              }
            </div>
          }
          {isUploading && <CircularProgress/>}
        <div>
          <Tabs
            onChange={handleTabChange}
            value={slideIndex}
          >
            <Tab label='White Cards'/>
            <Tab label='Black Cards'/>
          </Tabs>
          <SwipeableViews
            onChangeIndex={handleTabChange}
            index={slideIndex}
          >
            <div>
              <WhiteCardAdder addCard={(card) => addWhiteCard(card)}/>
              {
                whiteCards === undefined ?
                  <div>Failed to load cards!</div> :
                  <div className={classes.cardList}>
                    <InfiniteScroll
                      useWindow={false}
                      loadMore={async () => {
                        if (!isLoadingWhiteCards) {
                          const request = new ListWhiteCardsRequest();
                          request.setPageToken(nextWhiteCardPageToken);
                          request.setPageSize(10);
                          request.setParent(cardpack.getName());
                          setIsLoadingWhiteCards(true);
                          try {
                            const response = await listWhiteCards(request);
                            const nextPageToken = response.getNextPageToken();
                            setNextWhiteCardPageToken(nextPageToken);
                            if (nextPageToken.length === 0) {
                              setHasMoreWhiteCards(false);
                            }
                            setWhiteCards([
                              ...whiteCards,
                              ...response.getWhiteCardsList()
                            ]);
                          } catch (err) {
                            setWhiteCards(undefined);
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
                          {whiteCards.map((c, i) => (
                            <GridListTile style={{height: 'auto'}} key={i}>
                              <CAHWhiteCard card={c}/>
                            </GridListTile>
                          ))}
                        </GridList>
                      }
                    </InfiniteScroll>
                  </div>
              }
            </div>
            <div>
              <BlackCardAdder addCard={(card) => addBlackCard(card)}/>
              {
                blackCards === undefined ?
                  <div>Failed to load cards!</div> :
                  <div className={classes.cardList}>
                    <InfiniteScroll
                      useWindow={false}
                      loadMore={async () => {
                        if (!isLoadingBlackCards) {
                          const request = new ListBlackCardsRequest();
                          request.setPageToken(nextBlackCardPageToken);
                          request.setPageSize(10);
                          request.setParent(cardpack.getName());
                          setIsLoadingBlackCards(true);
                          try {
                            const response = await listBlackCards(request);
                            const nextPageToken = response.getNextPageToken();
                            setNextBlackCardPageToken(nextPageToken);
                            if (nextPageToken.length === 0) {
                              setHasMoreBlackCards(false);
                            }
                            setBlackCards([
                              ...blackCards,
                              ...response.getBlackCardsList()
                            ]);
                          } catch (err) {
                            setBlackCards(undefined);
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
                          {blackCards.map((c, i) => (
                            <GridListTile style={{height: 'auto'}} key={i}>
                              <CAHBlackCard card={c}/>
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
  );
}

export default CardpackViewer;
