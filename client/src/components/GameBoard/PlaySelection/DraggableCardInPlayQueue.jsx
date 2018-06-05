import React, { Component } from 'react';
import DragSource from 'react-dnd/lib/DragSource';
import CAHWhiteCard from '../../shells/CAHWhiteCard.jsx';
import { cardInHand } from '../../../dndTypes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { unqueueCard } from '../../../store/modules/game';

class DraggableCard extends Component {
  render() {
    return this.props.connectDragSource(<div onClick={() => this.props.unqueueCard(this.props.card.id)} style={{ opacity: this.props.isDragging ? 0.5 : 1 }}><CAHWhiteCard {...this.props} /></div>);
  }
}

const endDrag = (props, monitor) => {
  if (monitor.didDrop()) {
    props.onDrop(props.card.id);
  }
};

const DragSourceCard = DragSource(cardInHand, {beginDrag: () => ({}), endDrag}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DraggableCard);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  unqueueCard
}, dispatch);

export default connect(null, mapDispatchToProps)(DragSourceCard);