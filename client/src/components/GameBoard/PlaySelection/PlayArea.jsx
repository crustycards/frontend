import React, { Component } from 'react';
import DraggableCardInPlayQueue from './DraggableCardInPlayQueue.jsx';
import { cardInPlayQueue } from '../../../dndTypes';
import { DropTarget } from 'react-dnd/lib';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { unqueueCard } from '../../../store/modules/game';

class PlayArea extends Component {
  render() {
    const {cards, queuedCardIds, unqueueCard, connectDropTarget, isOver, canDrop} = this.props;

    return connectDropTarget(<div className='tray' style={{minHeight: '100px'}}>
      {queuedCardIds.map(id => cards.find(card => card.id === id)).map(card =>
        <DraggableCardInPlayQueue
          key={card.id}
          card={card}
          onDrop={() => unqueueCard(card.id)}
        />
      )}
    </div>);
  }
}

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