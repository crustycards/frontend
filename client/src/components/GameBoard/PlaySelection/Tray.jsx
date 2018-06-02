import React, { Component } from 'react';
import DraggableCardInHand from './DraggableCardInHand.jsx';
import { cardInHand } from '../../../dndTypes';
import { DropTarget } from 'react-dnd/lib';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { queueCard } from '../../../store/modules/game';

class Tray extends Component {
  render() {
    const {cards, queuedCardIds, queueCard, connectDropTarget, isOver, canDrop} = this.props;

    return connectDropTarget(<div className='tray' style={{minHeight: '100px'}}>
      {cards.filter(card => !queuedCardIds.includes(card.id)).map(card =>
        <DraggableCardInHand
          key={card.id}
          card={card}
          onDrop={() => queueCard(card.id)}
        />
      )}
    </div>);
  }
}

const DropTargetTray = DropTarget(cardInHand, {}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(Tray);

const mapStateToProps = ({game}) => ({
  cards: game.hand,
  queuedCardIds: game.queuedCardIds
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  queueCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DropTargetTray);