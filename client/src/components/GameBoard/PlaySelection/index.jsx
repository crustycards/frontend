import React from 'react';
import { connect } from 'react-redux';
import Tray from './Tray.jsx';
import PlayArea from './PlayArea.jsx';
import { Button } from '@material-ui/core';
import { playCards } from '../../../gameServerInterface';
import { canPlay } from '../../../store';

const PlaySelection = ({queuedCardIds, currentBlackCard}) => {
  return canPlay() ?
    <div>
      <Tray/>
      <PlayArea/>
      <Button
        variant={'contained'}
        color={'secondary'}
        disabled={!currentBlackCard || queuedCardIds.length !== currentBlackCard.answerFields}
        onClick={() => { playCards(queuedCardIds); }}
      >
        Play
      </Button>
    </div>
    :
    <div>
      <Tray/>
    </div>
};

const mapStateToProps = ({game: {queuedCardIds, currentBlackCard}}) => ({
  queuedCardIds,
  currentBlackCard
});

export default connect(mapStateToProps)(PlaySelection);