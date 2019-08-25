import * as React from 'react';
import {ConnectDropTarget, DropTarget} from 'react-dnd';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {cardInHand} from '../../../dndTypes';
import {canPlay, StoreState} from '../../../store';
import {unqueueCard} from '../../../store/modules/game';
import DraggableCardInHand from './DraggableCardInHand';

interface TrayProps {
  connectDropTarget: ConnectDropTarget;
  unqueueCard(cardId: string): void;
}

const Tray = ({
  connectDropTarget
}: TrayProps) => {
  const {game, user} = useSelector(({game, global: {user}}: StoreState) => ({game, user}));
  const {
    hand,
    queuedCardIds,
    whitePlayed,
    currentBlackCard,
    judgeId
  } = game;

  return connectDropTarget(
    <div
      style={{
        minHeight: '100px',
        width: '100%',
        overflowX: 'scroll',
        display: 'flex',
        backgroundColor: canPlay({
          whitePlayed,
          currentBlackCard,
          user,
          judgeId
        }) ? 'inherit' : 'grey'
      }}
    >
      {hand.filter((card) => !queuedCardIds.includes(card.id)).map((card) =>
        <DraggableCardInHand
          key={card.id}
          card={card}
        />
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  unqueueCard
}, dispatch);

const DropTargetTray = DropTarget(cardInHand, {drop: (props: TrayProps, monitor) => {
  props.unqueueCard(monitor.getItem().cardId);
}}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Tray);

export default connect(null, mapDispatchToProps)(DropTargetTray);
