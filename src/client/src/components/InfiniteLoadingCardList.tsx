import * as React from 'react';
import {useState} from 'react';
import {styled} from '@mui/material/styles';
import * as InfiniteScroll from 'react-infinite-scroller';
import {
  CircularProgress,
  ImageList,
  ImageListItem
} from '@mui/material';
import {
  CustomBlackCard,
  CustomWhiteCard,
  DefaultBlackCard,
  DefaultWhiteCard
} from '../../../../proto-gen-out/crusty_cards_api/model_pb';
import CAHCustomBlackCard from './shells/CAHCustomBlackCard';
import CAHCustomWhiteCard from './shells/CAHCustomWhiteCard';
import CAHDefaultBlackCard from './shells/CAHDefaultBlackCard';
import CAHDefaultWhiteCard from './shells/CAHDefaultWhiteCard';

const CardList = styled('div')({
  height: '200px',
  overflowX: 'hidden',
  overflowY: 'scroll'
});

interface InfiniteLoadingCardListProps<CardType extends (CustomBlackCard | CustomWhiteCard | DefaultBlackCard | DefaultWhiteCard)> {
  loadCards(pageToken: string): Promise<{cards: CardType[], nextPageToken: string}>
}

export const InfiniteLoadingCardList = <CardType extends (CustomBlackCard | CustomWhiteCard | DefaultBlackCard | DefaultWhiteCard)>(props: InfiniteLoadingCardListProps<CardType>) => {
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [nextCardPageToken, setNextCardPageToken] = useState('');
  const [cards, setCards] = useState<CardType[]>([]);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [hasMoreUnloadedCards, setHasMoreUnloadedCards] = useState(true);

  if (failedToLoad) {
    return <div>Failed to load cards!</div>;
  }

  return (
    <CardList>
      <InfiniteScroll
        useWindow={false}
        loadMore={async () => {
          if (!isLoadingCards) {
            try {
              setIsLoadingCards(true);
              const response = await props.loadCards(nextCardPageToken);
              setNextCardPageToken(response.nextPageToken);
              if (response.nextPageToken.length === 0) {
                setHasMoreUnloadedCards(false);
              }
              setCards([
                ...cards,
                ...response.cards
              ]);
            } catch (err) {
              setFailedToLoad(true);
            } finally {
              setIsLoadingCards(false);
            }
          }
        }}
        loader={<CircularProgress/>}
        hasMore={hasMoreUnloadedCards}
      >
        {
          <ImageList cols={4}>
            {cards.map((c, i) => (
              <ImageListItem style={{height: 'auto'}} key={i}>
                <CAHCard card={c}/>
              </ImageListItem>
            ))}
          </ImageList>
        }
      </InfiniteScroll>
    </CardList>
  );
};

const CAHCard = <CardType extends (CustomBlackCard | CustomWhiteCard | DefaultBlackCard | DefaultWhiteCard)>(props: {card: CardType}) => {
  if (props.card instanceof CustomBlackCard) {
    return <CAHCustomBlackCard card={props.card}/>;
  } else if (props.card instanceof CustomWhiteCard) {
    return <CAHCustomWhiteCard card={props.card}/>;
  } else if (props.card instanceof DefaultBlackCard) {
    return <CAHDefaultBlackCard card={props.card}/>;
  } else {
    return <CAHDefaultWhiteCard card={props.card}/>;
  }
};