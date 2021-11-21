import {List, ListItem} from '@mui/material';
import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {ListCustomCardpacksRequest} from '../../../../proto-gen-out/crusty_cards_api/cardpack_service_pb';
import {CustomCardpack} from '../../../../proto-gen-out/crusty_cards_api/model_pb';
import {listCustomCardpacks} from '../api/cardpackService';
import ProtobufInfiniteScroller from '../components/ProtobufInfiniteScroller';
import CAHCustomCardpack from '../components/shells/CAHCustomCardpack';
import {ContentWrap} from '../styles/globalStyles';

// TODO - Fix bug that causes all items to load even before scrolling down.
// TODO - Make page prettier to use.

const CustomCardpackPage = (props: RouteComponentProps<{user: string}>) => (
  <ContentWrap>
    <ProtobufInfiniteScroller<CustomCardpack>
      loadItems={
        async (pageToken, amount) => {
          const request = new ListCustomCardpacksRequest();
          request.setParent(`users/${props.match.params.user}`);
          request.setPageToken(pageToken);
          request.setPageSize(amount);
          const response = await listCustomCardpacks(request);
          return {
            items: response.getCustomCardpacksList(),
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
                <CAHCustomCardpack customCardpack={item}/>
              </ListItem>
            ))}
          </List>
        )
      }
    />
  </ContentWrap>
);

export default CustomCardpackPage;
