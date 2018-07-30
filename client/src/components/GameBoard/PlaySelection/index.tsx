import * as React from 'react';
import {connect} from 'react-redux';
import Tray from './Tray.jsx';
import PlayArea from './PlayArea.jsx';
import {Button} from '@material-ui/core';
import {canPlay, hasPlayed} from '../../../store';
import {ApiContextWrapper} from '../../../api/context';
import {BlackCard, User, WhitePlayed} from '../../../api/dao';
import Api from '../../../api/model/api';

interface PlaySelectionProps {
  queuedCardIds: Array<string>
  stage: string
  whitePlayed: WhitePlayed
  currentBlackCard: BlackCard
  user: User
  judgeId: string
  api: Api
}

const PlaySelection = ({
  queuedCardIds,
  stage,
  whitePlayed,
  currentBlackCard,
  user,
  judgeId,
  api
}: PlaySelectionProps) => (
  <div>
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
  </div>
);

const ContextLinkedPlaySelection = ApiContextWrapper(PlaySelection);

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
}: any) => ({
  queuedCardIds,
  stage,
  whitePlayed,
  currentBlackCard,
  user,
  judgeId
});

export default connect(mapStateToProps)(ContextLinkedPlaySelection);
