import React, { Component } from 'react';
import DragSource from 'react-dnd/lib/DragSource';
import CAHWhiteCard from '../../shells/CAHWhiteCard.jsx';
import { cardInPlayQueue } from '../../../dndTypes';

class DraggableCard extends Component {
  render() {
    const { isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.5 : 1;

    return connectDragSource(<div style={{ opacity }}><CAHWhiteCard {...this.props} /></div>);
  }
}

const endDrag = (props, monitor) => {
  if (monitor.didDrop()) {
    props.onDrop(props.card.id);
  }
};

export default DragSource(cardInPlayQueue, {beginDrag: () => ({}), endDrag}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DraggableCard);