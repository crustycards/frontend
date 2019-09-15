import {Button} from '@material-ui/core';
import * as React from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useApi} from '../../api/context';
import {StoreState} from '../../store';
import CAHWhiteCard from '../shells/CAHWhiteCard';

const PlayedCards = () => {
  const api = useApi();
  const {game, user} = useSelector(({game, global: {user}}: StoreState) => ({game, user}));
  const [selectedSetIndex, setSelectedSetIndex] = useState(null);

  if (game.stage === 'judgePhase') {
    return (
      <div className={'panel'}>
        {user.id === game.judgeId &&
          <Button
            variant={'contained'}
            color={'secondary'}
            disabled={selectedSetIndex === null}
            onClick={() => {
              api.game.vote(
                game.whitePlayedAnonymous[selectedSetIndex][0].id
              );
              setSelectedSetIndex(null);
            }}
          >
            Vote
          </Button>
        }
        {game.whitePlayedAnonymous.map((cards, index) => (
          <div
            className={'subpanel'}
            key={index}
            onClick={() => {
              if (user.id === game.judgeId) {
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
            {cards.map((card, index) => <CAHWhiteCard card={card} key={index} />)}
          </div>
        ))}
      </div>
    );
  } else if (
    game.stage === 'roundEndPhase' ||
    (
      game.stage === 'notRunning' &&
      game.winner
    )
  ) {
    return (
      <div className={'panel'}>
        {game.whitePlayed.map((entry, index) => (
          <div
            style={(game.winner && game.winner.user ?
              entry.player.user && entry.player.user.id === game.winner.user.id :
              game.winner.artificialPlayerName === entry.player.artificialPlayerName)
              ? {} : {opacity: 0.5}}
            className={'subpanel'}
            key={index}
          >
            <div>
              {
                entry.player.user ? entry.player.user.name : entry.player.artificialPlayerName
              }
            </div>
            {entry.cards.map((card, index) => (
              <CAHWhiteCard
                card={card}
                key={index}
              />
            ))}
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default PlayedCards;
