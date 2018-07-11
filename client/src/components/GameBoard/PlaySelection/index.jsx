import React from 'react';
import {connect} from 'react-redux';
import Tray from './Tray.jsx';
import PlayArea from './PlayArea.jsx';
import {Button} from '@material-ui/core';
import {playCards, unPlayCards} from '../../../gameServerInterface';
import {canPlay, hasPlayed} from '../../../store';

const PlaySelection = ({
  queuedCardIds,
  stage,
  whitePlayed,
  currentBlackCard,
  user,
  judgeId
}) => {
  return canPlay({whitePlayed, currentBlackCard, user, judgeId}) ?
    <div>
      <Tray/>
      <PlayArea/>
      <Button
        variant={'contained'}
        color={'secondary'}
        disabled={queuedCardIds.includes(null)}
        onClick={() => {
          playCards(queuedCardIds);
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
            unPlayCards();
          }}
        >
          Revert Play
        </Button>
      }
    </div>;
};

const mapStateToProps = ({
  game: {
    queuedCardIds,
    stage,
    whitePlayed,
    currentBlackCard,
    judgeId
  },
  global: {
    user
  }
}) => ({
  queuedCardIds,
  stage,
  whitePlayed,
  currentBlackCard,
  user,
  judgeId
});

export default connect(mapStateToProps)(PlaySelection);
