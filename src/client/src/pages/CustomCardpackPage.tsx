import {
  LinearProgress,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import * as React from 'react';
import {useState, useEffect} from 'react';
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
import {ContentWrap, Panel} from '../styles/globalStyles';
import ResourceNotFound from '../components/ResourceNotFound';
import {RouteComponentProps} from 'react-router';
import {InfiniteLoadingCardList} from '../components/InfiniteLoadingCardList';

const CustomCardpackPage =
(props: RouteComponentProps<{user: string, cardpack: string}>) => {
  const customCardpackName = `users/${props.match.params.user}/cardpacks/${props.match.params.cardpack}`;

  const [
    customCardpack,
    setCustomCardpack
  ] = useState<CustomCardpack | null | undefined>(undefined);

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
    <ContentWrap>
      <Panel>
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
                <InfiniteLoadingCardList loadCards={async (pageToken) => {
                  const request = new ListCustomWhiteCardsRequest();
                  request.setPageToken(pageToken);
                  request.setPageSize(10);
                  request.setParent(customCardpack.getName());
                  const response = await listCustomWhiteCards(request);
                  return {cards: response.getCustomWhiteCardsList(), nextPageToken: response.getNextPageToken()};
                }}/>
              </div>
              <div>
                <BlackCardAdder addCard={(card) => addCustomBlackCard(card)}/>
                <InfiniteLoadingCardList loadCards={async (pageToken) => {
                  const request = new ListCustomBlackCardsRequest();
                  request.setPageToken(pageToken);
                  request.setPageSize(10);
                  request.setParent(customCardpack.getName());
                  const response = await listCustomBlackCards(request);
                  return {cards: response.getCustomBlackCardsList(), nextPageToken: response.getNextPageToken()};
                }}/>
              </div>
            </SwipeableViews>
          </div>
        </div>
      </Panel>
    </ContentWrap>
  );
};

export default CustomCardpackPage;
