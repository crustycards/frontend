import {CircularProgress} from '@mui/material';
import * as React from 'react';
import {useState} from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';

interface ProtobufInfiniteScrollerProps<T> {
  loadItems(pageToken: string, amount: number): Promise<{
    items: T[],
    nextPageToken: string
  }>;
  renderItems(items: T[]): JSX.Element;
}

const ProtobufInfiniteScroller =
<T extends unknown>(props: ProtobufInfiniteScrollerProps<T>) => {
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  // TODO - Render a retry button if `failedToLoadItems` is true.
  const [failedToLoadItems, setFailedToLoadItems] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [hasMoreItems, setHasMoreItems] = useState(true);

  return (
    <InfiniteScroll
      loadMore={async () => {
        if (!isLoadingItems) {
          setIsLoadingItems(true);
          try {
            const response = await props.loadItems(nextPageToken, 10);
            setNextPageToken(response.nextPageToken);
            if (response.nextPageToken.length === 0) {
              setHasMoreItems(false);
            }
            setItems([
              ...items,
              ...response.items
            ]);
          } catch (err) {
            setFailedToLoadItems(true);
          } finally {
            setIsLoadingItems(false);
          }
        }
      }}
      loader={
        <div style={{textAlign: 'center'}}>
          <CircularProgress/>
        </div>
      }
      hasMore={hasMoreItems}
      useWindow={false}
    >
      {props.renderItems(items)}
    </InfiniteScroll>
  );
};

export default ProtobufInfiniteScroller;