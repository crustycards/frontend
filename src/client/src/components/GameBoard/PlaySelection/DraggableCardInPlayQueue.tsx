import * as React from 'react';
import {ConnectDragSource, DragObjectWithType, DragSource, useDrag} from 'react-dnd';
import {useDispatch} from 'react-redux';
import {WhiteCard} from '../../../api/dao';
import {cardInHand} from '../../../dndTypes';
import {unqueueCard} from '../../../store/modules/game';
import CAHWhiteCard from '../../shells/CAHWhiteCard';

interface DraggableCardProps {
  card: WhiteCard;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}

const DraggableCard = (props: DraggableCardProps) => {
  const dispatch = useDispatch();

  return props.connectDragSource(
    <div
      onClick={() => dispatch(unqueueCard(props.card.id))}
      style={{opacity: props.isDragging ? 0.5 : 1}}
    >
      <CAHWhiteCard {...props} />
    </div>
  );
};

export default DragSource(
  cardInHand,
  {beginDrag: (props: DraggableCardProps) => ({cardId: props.card.id})},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(DraggableCard);
