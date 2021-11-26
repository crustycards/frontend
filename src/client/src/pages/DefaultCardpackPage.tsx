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
  ListDefaultBlackCardsRequest,
  ListDefaultWhiteCardsRequest
} from '../../../../proto-gen-out/crusty_cards_api/cardpack_service_pb';
import {DefaultCardpack} from '../../../../proto-gen-out/crusty_cards_api/model_pb';
import {
  getDefaultCardpack,
  listDefaultBlackCards,
  listDefaultWhiteCards
} from '../api/cardpackService';
import ResourceNotFound from '../components/ResourceNotFound';
import {RouteComponentProps} from 'react-router';
import {ContentWrap, Panel} from '../styles/globalStyles';
import {InfiniteLoadingCardList} from '../components/InfiniteLoadingCardList';

const DefaultCardpackPage =
(props: RouteComponentProps<{cardpack: string}>) => {
  const defaultCardpackName = `defaultCardpacks/${props.match.params.cardpack}`;

  const [
    defaultCardpack,
    setDefaultCardpack
  ] = useState<DefaultCardpack | null | undefined>(undefined);

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
    <ContentWrap>
      <Panel>
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
              <InfiniteLoadingCardList loadCards={async (pageToken) => {
                const request = new ListDefaultWhiteCardsRequest();
                request.setPageToken(pageToken);
                request.setPageSize(10);
                request.setParent(defaultCardpack.getName());
                const response = await listDefaultWhiteCards(request);
                return {cards: response.getDefaultWhiteCardsList(), nextPageToken: response.getNextPageToken()};
              }}/>
              <InfiniteLoadingCardList loadCards={async (pageToken) => {
                const request = new ListDefaultBlackCardsRequest();
                request.setPageToken(pageToken);
                request.setPageSize(10);
                request.setParent(defaultCardpack.getName());
                const response = await listDefaultBlackCards(request);
                return {cards: response.getDefaultBlackCardsList(), nextPageToken: response.getNextPageToken()};
              }}/>
            </SwipeableViews>
          </div>
        </div>
      </Panel>
    </ContentWrap>
  );
};

export default DefaultCardpackPage;
