import * as React from 'react';
import {
  Typography,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  useTheme
} from '@mui/material';
import {Subpanel} from '../../styles/globalStyles';
import ProtobufInfiniteScroller from '../ProtobufInfiniteScroller';

interface InfiniteScrollCheckboxListProps<T> {
  headerName: string;
  loadItems(pageToken: string, amount: number): Promise<{
    items: T[],
    nextPageToken: string
  }>;
  checkedItemNames: string[];
  toggleItemCheckedState(item: T): void;
}

const InfiniteScrollCheckboxList = <T extends {
  getName(): string,
  getDisplayName(): string
}>(props: InfiniteScrollCheckboxListProps<T>) => {
  const theme = useTheme();

  return (
    <Subpanel>
      <Typography variant={'h6'} align={'center'}>
        {props.headerName}
      </Typography>
      <div style={{
        height: '200px',
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper
      }}>
        <ProtobufInfiniteScroller
          loadItems={props.loadItems}
          renderItems={
            (items) => (
              <List>
                {items.map((item, i) => (
                  <ListItem
                    key={i}
                  >
                    <Checkbox
                      checked={
                        props.checkedItemNames.reduce<boolean>(
                          (acc, checkedItemIdentifier) => {
                            if (acc) {
                              return true;
                            }

                            return item.getName() === checkedItemIdentifier;
                          },
                          false
                        )
                      }
                      onChange={() => props.toggleItemCheckedState(item)}
                    />
                    <ListItemText
                      primary={
                        <Typography>
                          {item.getDisplayName()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )
          }
        />
      </div>
    </Subpanel>
  );
};

export default InfiniteScrollCheckboxList;