import * as React from 'react';
import {Component} from 'react';
import {ConnectDragSource} from 'react-dnd';
import DragSource from 'react-dnd/lib/DragSource';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import { WhiteCard } from '../../../api/dao';
import {cardInHand} from '../../../dndTypes';
import {unqueueCard} from '../../../store/modules/game';
import CAHWhiteCard from '../../shells/CAHWhiteCard';

// TODO - Remove ?'s from DraggableCardProps properties and fix react-dnd typescript issues
interface DraggableCardProps {
  card: WhiteCard;
  isDragging?: boolean;
  connectDragSource?: ConnectDragSource;
  unqueueCard(cardId: string): void;
}

class DraggableCard extends Component<DraggableCardProps> {
  public render() {
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

const DragSourceDraggableCard = DragSource(
  cardInHand,
  {beginDrag: (props: DraggableCardProps) => ({cardId: props.card.id})},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(DraggableCard);
export default connect(null, mapDispatchToProps)(DragSourceDraggableCard);
