import React, { Component } from 'react';
import DraggableCardInHand from './DraggableCardInHand.jsx';
import { cardInHand } from '../../../dndTypes';
import { DropTarget } from 'react-dnd/lib';
import { connect } from 'react-redux';
import { canPlay } from '../../../store';
import { unqueueCard } from '../../../store/modules/game';
import { bindActionCreators } from 'redux';

class Tray extends Component {
  render() {
    const { cards, queuedCardIds, connectDropTarget } = this.props;

    return connectDropTarget(
      <div className='tray' style={{minHeight: '100px', backgroundColor: canPlay() ? 'inherit' : 'grey'}}>
        {cards.filter(card => !queuedCardIds.includes(card.id)).map(card =>
          <DraggableCardInHand
            key={card.id}
            card={card}
          />
        )}
      </div>
    );
  }
}

const DropTargetTray = DropTarget(cardInHand, { drop: (props, monitor) => { props.unqueueCard(monitor.getItem().cardId) } }, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(Tray);

const mapStateToProps = ({game}) => ({
  cards: game.hand,
  queuedCardIds: game.queuedCardIds
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  unqueueCard
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DropTargetTray);