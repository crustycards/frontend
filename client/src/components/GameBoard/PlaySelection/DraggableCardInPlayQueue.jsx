import React, { Component } from 'react';
import DragSource from 'react-dnd/lib/DragSource';
import CAHWhiteCard from '../../shells/CAHWhiteCard.jsx';
import { cardInHand } from '../../../dndTypes';

class DraggableCard extends Component {
  render() {
    return this.props.connectDragSource(<div style={{ opacity: this.props.isDragging ? 0.5 : 1 }}><CAHWhiteCard {...this.props} /></div>);
  }
}

const endDrag = (props, monitor) => {
  if (monitor.didDrop()) {
    props.onDrop(props.card.id);
  }
};

export default DragSource(cardInHand, {beginDrag: () => ({}), endDrag}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DraggableCard);