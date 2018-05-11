import React from 'react';
import DraggableCardInPlayQueue from './DraggableCardInPlayQueue.jsx';
import { cardInPlayQueue } from '../../../dndTypes';
import { DropTarget } from 'react-dnd/lib';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { unqueueCard } from '../../../store/modules/game';

const PlayArea = ({cards, queuedCardIds, unqueueCard, connectDropTarget, isOver, canDrop}) => (
  connectDropTarget(<div className='tray' style={{minHeight: '100px'}}>
    {cards.filter(card => queuedCardIds.includes(card.id)).map(card =>
      <DraggableCardInPlayQueue
        key={card.id}
        card={card}
        onDrop={() => unqueueCard(card.id)}
      />
    )}
  </div>)
);

const DropTargetPlayArea = DropTarget(cardInPlayQueue, {}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(PlayArea);

const mapStateToProps = ({game}) => ({
  cards: game.hand,
  queuedCardIds: game.queuedCardIds
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  unqueueCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DropTargetPlayArea);