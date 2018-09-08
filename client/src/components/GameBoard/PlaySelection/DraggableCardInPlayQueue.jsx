import React, {Component} from 'react';
import DragSource from 'react-dnd/lib/DragSource';
import CAHWhiteCard from '../../shells/CAHWhiteCard.tsx';
import {cardInHand} from '../../../dndTypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {unqueueCard} from '../../../store/modules/game';

@DragSource(
  cardInHand,
  {beginDrag: (props) => ({cardId: props.card.id})},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)
class DraggableCard extends Component {
  render() {
    return this.props.connectDragSource(
      <div
        onClick={() => this.props.unqueueCard(this.props.card.id)}
        style={{opacity: this.props.isDragging ? 0.5 : 1}}
      >
        <CAHWhiteCard {...this.props} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  unqueueCard
}, dispatch);

export default connect(null, mapDispatchToProps)(DraggableCard);
