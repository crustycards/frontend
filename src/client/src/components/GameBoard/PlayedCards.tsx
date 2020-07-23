import {Button} from '@material-ui/core';
import * as React from 'react';
import {useState} from 'react';
import {WhiteCard, User} from '../../../../../proto-gen-out/api/model_pb';
import {
  GameView,
  Player,
  WhiteCardsPlayed
} from '../../../../../proto-gen-out/game/game_service_pb';
import {getPlayerDisplayName, playersAreEqual} from '../../helpers/proto';
import CAHWhiteCard from '../shells/CAHWhiteCard';
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
// Condense it downas much as possible.
// TODO - This component should definitely have some tests to make sure it can
// handle random invalid inputs, especially for game.view.whitePlayed.
const PlayedCards = (props: PlayedCardsProps) => {
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);

  const globalClasses = useGlobalStyles();

  if (props.gameStage === GameView.Stage.JUDGE_PHASE) {
    return (
      <div className={globalClasses.panel}>
        {
          props.judge?.getName() === props.currentUser.getName() &&
            <Button
              variant={'contained'}
              color={'secondary'}
              disabled={selectedSetIndex === null}
              onClick={() => {
                if (selectedSetIndex !== null) {
                  // TODO - Set selected index to null only after voteCard
                  // promise resolves, and show loading spinner until then.
                  props.gameService.voteCard(selectedSetIndex);
                  setSelectedSetIndex(null);
                }
              }}
            >
              Vote
            </Button>
        }
        {
          props.whitePlayedList
            .map((entry) => entry.getCardTextsList())
            .map((cardTexts, index) => (
              <div
                className={globalClasses.subpanel}
                key={index}
                onClick={() => {
                  if (props.judge?.getName() === props.currentUser.getName()) {
                    setSelectedSetIndex(index);
                  }
                }}
                style={index === selectedSetIndex ?
                  {
                    background: 'green',
                    transition: 'background .25s ease'
                  }
                  :
                  {
                    transition: 'background .2s ease'
                  }
                }
              >
                {
                  cardTexts.map((cardText) => {
                    const card = new WhiteCard();
                    card.setText(cardText);
                    return card;
                  }).map((card, index) =>
                    <CAHWhiteCard card={card} key={index}/>
                  )
                }
              </div>
            ))
        }
      </div>
    );
  } else if (
    props.gameWinner && (props.gameStage === GameView.Stage.ROUND_END_PHASE ||
    props.gameStage === GameView.Stage.NOT_RUNNING)
  ) {
    return (
      <div className={globalClasses.panel}>
        {
          props.whitePlayedList.filter(
            (entry) => entry.hasPlayer()
          ).map((entry, index) => (
            <div
              style={
                playersAreEqual(props.gameWinner, entry.getPlayer()) ?
                  {}
                  :
                  {opacity: 0.5}
              }
              className={globalClasses.subpanel}
              key={index}
            >
              <div>
                {
                  getPlayerDisplayName(entry.getPlayer())
                }
              </div>
              {entry.getCardTextsList().map((cardText) => {
                const card = new WhiteCard();
                card.setText(cardText);
                return card;
              }).map((card, index) => (
                <CAHWhiteCard
                  card={card}
                  key={index}
                />
              ))}
            </div>
          ))
        }
      </div>
    );
  } else {
    return null;
  }
};

export default PlayedCards;
