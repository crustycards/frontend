import * as React from 'react';
import {
  Typography,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Theme
} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/styles';
import {useGlobalStyles} from '../../styles/globalStyles';
import ProtobufInfiniteScroller from '../ProtobufInfiniteScroller';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      height: '200px',
      overflow: 'auto',
      backgroundColor: theme.palette.background.paper
    }
  })
);

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
  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  return (
    <div className={globalClasses.subpanel}>
      <Typography variant={'h6'} align={'center'}>
        {props.headerName}
      </Typography>
      <div className={classes.list}>
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
    </div>
  );
};

export default InfiniteScrollCheckboxList;