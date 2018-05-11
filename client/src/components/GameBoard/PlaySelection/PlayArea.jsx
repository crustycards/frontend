import React from 'react';
import DraggableCardInPlayQueue from './DraggableCardInPlayQueue.jsx';
import { cardInPlayQueue } from '../../../dndTypes';
import { DropTarget } from 'react-dnd/lib';

const PlayArea = ({cards, connectDropTarget, isOver, canDrop}) => (
  connectDropTarget(<div className='tray' style={{minHeight: '100px'}}>
    {cards.map(card =>
      <DraggableCardInPlayQueue
        key={card.id}
        card={card}
      />
    )}
  </div>)
);

export default DropTarget(cardInPlayQueue, {
  drop: console.log
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(PlayArea);