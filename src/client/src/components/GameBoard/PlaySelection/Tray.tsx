import * as React from 'react';
import {ConnectDropTarget, DropTarget} from 'react-dnd';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {PlayableWhiteCard, GameView} from '../../../../../../proto-gen-out/api/game_service_pb';
import {cardInHand} from '../../../dndTypes';
import {canPlay} from '../../../store';
import {unqueueCard, QueuedCardId} from '../../../store/modules/game';
import {queuedCardIdPointsToPlayableCard} from '../../../store/modules/game';
import DraggableCardInHand from './DraggableCardInHand';
import {User} from '../../../../../../proto-gen-out/api/model_pb';

interface TrayProps {
  currentUser: User;
  gameView: GameView;
  queuedCardIds: (QueuedCardId | null)[];
  connectDropTarget: ConnectDropTarget;
  unqueueCard(card: PlayableWhiteCard): void;
}

const Tray = (props: TrayProps) => {
  return props.connectDropTarget(
    <div
      style={{
        minHeight: '100px',
        width: '100%',
        overflowX: 'scroll',
        display: 'flex',
        backgroundColor: canPlay(props.gameView, props.currentUser) ?
          'inherit' : 'grey'
      }}
    >
      {
        props.gameView.getHandList()
          .filter((card) =>
            !props.queuedCardIds.find((queuedCardId) =>
              queuedCardIdPointsToPlayableCard(queuedCardId, card)
            )
          )
          .map((card, index) => (
            <DraggableCardInHand
              currentUser={props.currentUser}
              gameView={props.gameView}
              key={index}
              card={card}
            />
          ))
      }
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  unqueueCard
}, dispatch);

const DropTargetTray = DropTarget(
  cardInHand,
  {
    drop: (props: TrayProps, monitor) => {
      props.unqueueCard(monitor.getItem());
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(Tray);

// TODO - Remove `connect` and `mapDispatchToProps` and use React hooks.
export default connect(null, mapDispatchToProps)(DropTargetTray);
