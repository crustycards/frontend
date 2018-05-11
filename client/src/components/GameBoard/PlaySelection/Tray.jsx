import React from 'react';
import DraggableCardInHand from './DraggableCardInHand.jsx';
import { cardInHand } from '../../../dndTypes';
import { DropTarget } from 'react-dnd/lib';

const Tray = ({cards, connectDropTarget, isOver, canDrop}) => (
  connectDropTarget(<div className='tray' style={{minHeight: '100px'}}>
    {cards.map(card =>
      <DraggableCardInHand
        key={card.id}
        card={card}
      />
    )}
  </div>)
);

export default DropTarget(cardInHand, {
  drop: console.log
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(Tray);