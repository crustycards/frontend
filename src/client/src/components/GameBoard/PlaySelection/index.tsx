import {Button} from '@material-ui/core';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {GameView, PlayableWhiteCard} from '../../../../../../proto-gen-out/game/game_service_pb';
import {useGameService} from '../../../api/context';
import {canPlay, hasPlayed, StoreState} from '../../../store';
import {queuedCardIdPointsToPlayableCard, QueuedCardId} from '../../../store/modules/game';
import PlayArea from './PlayArea';
import Tray from './Tray';
import {BlackCard, User} from '../../../../../../proto-gen-out/api/model_pb';
import {GameService} from '../../../api/gameService';

interface PlaySelectionProps {
  gameService: GameService;
  currentUser: User;
  gameView: GameView;
  queuedCardIds: (QueuedCardId | null)[];
}

const PlaySelection = (props: PlaySelectionProps) => {
  const currentBlackCard = props.gameView.getCurrentBlackCard();

  return <div>
    {
      canPlay(props.gameView, props.currentUser) ?
        <div>
          <Tray
            currentUser={props.currentUser}
            gameView={props.gameView}
            queuedCardIds={props.queuedCardIds}
          />
          {
            currentBlackCard &&
              <PlayArea
                gameView={props.gameView}
                playSlots={currentBlackCard.getAnswerFields()}
              />
          }
          <Button
            variant={'contained'}
            color={'secondary'}
            disabled={props.queuedCardIds.includes(null)}
            onClick={() => {
              props.gameService.playCards(
                props.queuedCardIds.map(
                  (queuedCardId) => props.gameView.getHandList().find((card) =>
                    queuedCardIdPointsToPlayableCard(queuedCardId, card))
                ).reduce<PlayableWhiteCard[]>((acc, card) => {
                  if (card) {
                    acc.push(card);
                  }
                  return acc;
                }, [])
              );
            }}
          >
            Play
          </Button>
        </div>
        :
        <div>
          <Tray
            currentUser={props.currentUser}
            gameView={props.gameView}
            queuedCardIds={props.queuedCardIds}
          />
          {
            hasPlayed(props.currentUser, props.gameView) &&
            props.gameView.getStage() === GameView.Stage.PLAY_PHASE &&
              <Button
                variant={'contained'}
                color={'secondary'}
                onClick={() => {
                  props.gameService.unplayCards();
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
