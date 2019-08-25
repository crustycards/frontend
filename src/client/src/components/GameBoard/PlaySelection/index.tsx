import {Button} from '@material-ui/core';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {useApi} from '../../../api/context';
import {canPlay, hasPlayed, StoreState} from '../../../store';
import PlayArea from './PlayArea';
import Tray from './Tray';

const PlaySelection = () => {
  const api = useApi();
  const {game, user} = useSelector(({game, global: {user}}: StoreState) => ({game, user}));
  const {
    queuedCardIds,
    stage,
    whitePlayed,
    currentBlackCard,
    judgeId
  } = game;

  return <div>
    {
      canPlay({whitePlayed, currentBlackCard, user, judgeId}) ?
        <div>
          <Tray/>
          <PlayArea/>
          <Button
            variant={'contained'}
            color={'secondary'}
            disabled={queuedCardIds.includes(null)}
            onClick={() => {
              api.game.playCards(queuedCardIds);
            }}
          >
            Play
          </Button>
        </div>
        :
        <div>
          <Tray/>
          {
            hasPlayed({whitePlayed, currentBlackCard, user}) && stage === 'playPhase' &&
            <Button
              variant={'contained'}
              color={'secondary'}
              onClick={() => {
                api.game.unPlayCards();
              }}
            >
              Revert Play
            </Button>
          }
        </div>
    }
  </div>;
};

export default PlaySelection;
