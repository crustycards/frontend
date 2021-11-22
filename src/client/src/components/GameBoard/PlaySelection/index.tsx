import {Button} from '@mui/material';
import * as React from 'react';
import {GameView, PlayableWhiteCard} from '../../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {canPlay, userHasPlayed} from '../../../store';
import {queuedCardIdPointsToPlayableCard, QueuedCardId} from '../../../store/modules/game';
import PlayArea from './PlayArea';
import Tray from './Tray';
import {User} from '../../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {GameService} from '../../../api/gameService';
import {getAnswerFieldsForBlackCardInRound} from '../../../helpers/proto';

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
                playSlots={
                  getAnswerFieldsForBlackCardInRound(currentBlackCard) || 0
                }
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
            userHasPlayed(props.currentUser, props.gameView) &&
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
