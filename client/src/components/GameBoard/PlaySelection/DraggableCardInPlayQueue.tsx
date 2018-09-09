import * as React from 'react';
import {Component} from 'react';
import DragSource from 'react-dnd/lib/DragSource';
import CAHWhiteCard from '../../shells/CAHWhiteCard';
import {cardInHand} from '../../../dndTypes';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {unqueueCard} from '../../../store/modules/game';
import {ConnectDragSource} from 'react-dnd';
import { WhiteCard } from '../../../api/dao';

// TODO - Remove ?'s from DraggableCardProps properties and fix react-dnd typescript issues
interface DraggableCardProps {
  card: WhiteCard
  unqueueCard(cardId: string): void
  isDragging?: boolean
  connectDragSource?: ConnectDragSource
}

@DragSource(
  cardInHand,
  {beginDrag: (props: DraggableCardProps) => ({cardId: props.card.id})},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)
class DraggableCard extends Component<DraggableCardProps> {
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

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  unqueueCard
}, dispatch);

export default connect(null, mapDispatchToProps)(DraggableCard);
