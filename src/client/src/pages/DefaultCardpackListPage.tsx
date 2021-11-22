import {List, ListItem} from '@mui/material';
import * as React from 'react';
import {ListDefaultCardpacksRequest} from '../../../../proto-gen-out/crusty_cards_api/cardpack_service_pb';
import {DefaultCardpack} from '../../../../proto-gen-out/crusty_cards_api/model_pb';
import {listDefaultCardpacks} from '../api/cardpackService';
import ProtobufInfiniteScroller from '../components/ProtobufInfiniteScroller';
import CAHDefaultCardpack from '../components/shells/CAHDefaultCardpack';
import {ContentWrap} from '../styles/globalStyles';

// TODO - Fix bug that causes all items to load even before scrolling down.
// TODO - Make page prettier to use.

const DefaultCardpackPage = () => (
  <ContentWrap>
    <ProtobufInfiniteScroller<DefaultCardpack>
      loadItems={
        async (pageToken, amount) => {
          const request = new ListDefaultCardpacksRequest();
          request.setPageToken(pageToken);
          request.setPageSize(amount);
          const response = await listDefaultCardpacks(request);
          return {
            items: response.getDefaultCardpacksList(),
            nextPageToken: response.getNextPageToken()
          };
        }
      }
      renderItems={
        (items) => (
          <List>
            {items.map((item, i) => (
              <ListItem
                key={i}
              >
                <CAHDefaultCardpack defaultCardpack={item}/>
              </ListItem>
            ))}
          </List>
        )
      }
    />
  </ContentWrap>
);

export default DefaultCardpackPage;
