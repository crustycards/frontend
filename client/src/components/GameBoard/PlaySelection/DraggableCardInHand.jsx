import React, { Component } from 'react';
import DragSource from 'react-dnd/lib/DragSource';
import CAHWhiteCard from '../../shells/CAHWhiteCard.jsx';
import { cardInPlayQueue } from '../../../dndTypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { queueCard } from '../../../store/modules/game';
import { canPlay } from '../../../store';

class DraggableCard extends Component {
  render() {
    return this.props.connectDragSource(<div onClick={() => canPlay() && this.props.queueCard({cardId: this.props.card.id})} style={{ opacity: this.props.isDragging || !canPlay() ? 0.5 : 1 }}><CAHWhiteCard {...this.props} /></div>);
  }
}

const endDrag = (props, monitor) => {
  if (monitor.didDrop()) {
    props.onDrop(props.card.id);
  }
};

const DragSourceCard = DragSource(cardInPlayQueue, {beginDrag: () => ({}), endDrag}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DraggableCard);

const mapStateToProps = ({game, user: {currentUser}}) => ({
  currentUserId: currentUser.id,
  currentJudgeId: game.judgeId
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  queueCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DragSourceCard);