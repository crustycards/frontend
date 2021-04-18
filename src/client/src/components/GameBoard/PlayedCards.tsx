import {Button, Typography} from '@material-ui/core';
import * as React from 'react';
import {useState} from 'react';
import {CustomWhiteCard, User} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {
  GameView,
  Player,
  WhiteCardsPlayed
} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {getPlayerDisplayName, playersAreEqual} from '../../helpers/proto';
import CAHCustomWhiteCard from '../shells/CAHCustomWhiteCard';
import {GameService} from '../../api/gameService';
import {useGlobalStyles} from '../../styles/globalStyles';

interface PlayedCardsProps {
  gameService: GameService;
  gameWinner: Player | undefined;
  currentUser: User;
  judge?: User;
  gameStage: GameView.Stage;
  whitePlayedList: WhiteCardsPlayed[];
}

// TODO - This component has a lot of repeated code.
// Condense it down as much as possible.
// TODO - This component should definitely have some tests to make sure it can
// handle random invalid inputs, especially for game.view.whitePlayed.
const PlayedCards = (props: PlayedCardsProps) => {
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);

  const globalClasses = useGlobalStyles();

  const canVote = props.judge?.getName() === props.currentUser.getName()
               && props.gameStage === GameView.Stage.JUDGE_PHASE;

  const nonEmptyWhitePlayedList = props.whitePlayedList
    .filter((entry) => entry.getCardTextsList().length > 0);

  if (!canVote && selectedSetIndex != null) {
    setSelectedSetIndex(null);
  }

  if (nonEmptyWhitePlayedList.length === 0) {
    return <div></div>;
  }

  return (
    <div className={globalClasses.panel}>
      {
        canVote &&
          <Button
            variant={'contained'}
            color={'secondary'}
            disabled={selectedSetIndex === null}
            onClick={() => {
              if (selectedSetIndex !== null) {
                // TODO - Set selected index to null only after voteCard
                // promise resolves, and show loading spinner until then.
                props.gameService.voteCard(selectedSetIndex + 1);
                setSelectedSetIndex(null);
              }
            }}
          >
            Vote
          </Button>
      }
      {
        nonEmptyWhitePlayedList
          .map((entry, index) => (
            <div
              className={globalClasses.subpanel}
              key={index}
              onClick={() => {
                if (canVote) {
                  setSelectedSetIndex(index);
                }
              }}
              style={
                {
                  // TODO - Instead of green, let's use the
                  // primary color from the Material UI theme.
                  background: index === selectedSetIndex ? 'green' : undefined,
                  transition: 'background .3s ease',
                  opacity: (
                    props.gameWinner === undefined
                    || playersAreEqual(props.gameWinner, entry.getPlayer())
                  ) ? undefined : 0.5
                }
              }
            >
              {
                entry.hasPlayer() &&
                  <Typography>
                    {getPlayerDisplayName(entry.getPlayer())}
                  </Typography>
              }
              {
                entry.getCardTextsList().map((cardText) => {
                  const card = new CustomWhiteCard();
                  card.setText(cardText);
                  return card;
                }).map((card, index) =>
                  <CAHCustomWhiteCard card={card} key={index}/>
                )
              }
            </div>
          ))
      }
    </div>
  );
};

export default PlayedCards;
