import * as React from 'react';
import {ConnectDragSource, DragSource} from 'react-dnd';
import {useDispatch} from 'react-redux';
import {PlayableWhiteCard} from '../../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {cardInHand} from '../../../dndTypes';
import {unqueueCard} from '../../../store/modules/game';
import CAHPlayableWhiteCard from '../../shells/CAHPlayableWhiteCard';

interface DraggableCardProps {
  card: PlayableWhiteCard;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}

const DraggableCard = (props: DraggableCardProps) => {
  const dispatch = useDispatch();

  return props.connectDragSource(
    <div
      onClick={() => dispatch(unqueueCard(props.card))}
      style={{opacity: props.isDragging ? 0.5 : 1}}
    >
      <CAHPlayableWhiteCard card={props.card}/>
    </div>
  );
};

export default DragSource(
  cardInHand,
  {beginDrag: (props: DraggableCardProps) => (props.card)},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(DraggableCard);
