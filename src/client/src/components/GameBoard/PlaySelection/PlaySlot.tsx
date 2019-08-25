import * as React from 'react';
import {ConnectDropTarget, DropTarget} from 'react-dnd';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {cardInHand, cardInPlayQueue} from '../../../dndTypes';
import {StoreState} from '../../../store';
import {queueCard} from '../../../store/modules/game';
import DraggableCardInPlayQueue from './DraggableCardInPlayQueue';

interface PlaySlotProps {
  index: number;
  connectDropTarget: ConnectDropTarget;
  queueCard: ({index, cardId}: {index: number, cardId: string}) => void;
}

const PlaySlot = (props: PlaySlotProps) => {
  const {game} = useSelector(({game}: StoreState) => ({game}));
  const {queuedCardIds, hand} = game;

  if (queuedCardIds[props.index]) {
    const card = hand.find(
      (card) => card.id === queuedCardIds[props.index]
    );
    return props.connectDropTarget(
      <div>
        <DraggableCardInPlayQueue
          key={card.id}
          card={card}
        />
      </div>
    );
  } else {
    return props.connectDropTarget(
      <div
        className={'panel'}
        style={{
          textAlign: 'center',
          borderStyle: 'dotted',
          padding: '10px',
          margin: '5px 0'
        }}
      >
        Drop a card here
      </div>
    );
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({queueCard}, dispatch);

const DropTargetPlaySlot = DropTarget([cardInHand, cardInPlayQueue], {drop: (props: PlaySlotProps, monitor) => {
  props.queueCard({index: props.index, cardId: monitor.getItem().cardId});
}}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(PlaySlot);

export default connect(null, mapDispatchToProps)(DropTargetPlaySlot);
