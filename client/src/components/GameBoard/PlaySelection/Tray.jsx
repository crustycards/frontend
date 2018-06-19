import React, { Component } from 'react';
import DraggableCardInHand from './DraggableCardInHand.jsx';
import { cardInHand } from '../../../dndTypes';
import { DropTarget } from 'react-dnd/lib';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { queueCard } from '../../../store/modules/game';

class Tray extends Component {
  render() {
    const { isJudge, cards, queuedCardIds, queueCard, connectDropTarget, isOver, canDrop } = this.props;

    return connectDropTarget(
      <div className='tray' style={{minHeight: '100px', backgroundColor: isJudge ? 'grey' : 'inherit'}}>
        {cards.filter(card => !queuedCardIds.includes(card.id)).map(card =>
          <DraggableCardInHand
            key={card.id}
            card={card}
            onDrop={() => queueCard(card.id)}
          />
        )}
      </div>
    );
  }
}

const DropTargetTray = DropTarget(cardInHand, {}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(Tray);

const mapStateToProps = ({game, user: {currentUser}}) => ({
  cards: game.hand,
  queuedCardIds: game.queuedCardIds,
  isJudge: currentUser.id === game.judgeId
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  queueCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DropTargetTray);