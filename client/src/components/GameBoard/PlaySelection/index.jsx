import React from 'react';
import { connect } from 'react-redux';
import Tray from './Tray.jsx';
import PlayArea from './PlayArea.jsx';
import { Button } from '@material-ui/core';
import { playCards } from '../../../gameServerInterface';

const PlaySelection = (props) => (
  props.currentUserId === props.currentJudgeId ?
    <div>
      <Tray/>
    </div>
    :
    <div>
      <Tray/>
      <PlayArea/>
      <Button
        variant={'contained'}
        color={'secondary'}
        disabled={!props.currentBlackCard || props.queuedCardIds.length !== props.currentBlackCard.answerFields}
        onClick={() => { playCards(props.queuedCardIds); }}
      >
        Play
      </Button>
    </div>
);

const mapStateToProps = ({game, user: {currentUser}}) => ({
  currentUserId: currentUser.id,
  currentJudgeId: game.judgeId,
  queuedCardIds: game.queuedCardIds,
  currentBlackCard: game.currentBlackCard
});

export default connect(mapStateToProps)(PlaySelection);