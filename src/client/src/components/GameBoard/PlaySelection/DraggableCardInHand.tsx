import * as React from 'react';
import {ConnectDragSource, DragSource} from 'react-dnd';
import {useDispatch} from 'react-redux';
import {PlayableWhiteCard, GameView} from '../../../../../../proto-gen-out/api/game_service_pb';
import {cardInPlayQueue} from '../../../dndTypes';
import {canPlay} from '../../../store';
import {queueCard} from '../../../store/modules/game';
import CAHPlayableWhiteCard from '../../shells/CAHPlayableWhiteCard';
import {User} from '../../../../../../proto-gen-out/api/model_pb';

interface DraggableCardProps {
  currentUser: User;
  gameView: GameView;
  card: PlayableWhiteCard;
  isDragging: boolean;
  connectDragSource: ConnectDragSource;
}

const DraggableCard = (props: DraggableCardProps) => {
  const dispatch = useDispatch();

  return props.connectDragSource(
    <div
      onClick={() => (
        canPlay(props.gameView, props.currentUser) &&
        dispatch(queueCard({card: props.card}))
      )}
      style={{
        opacity: (props.isDragging ||
          !canPlay(props.gameView, props.currentUser) ? 0.5 : 1
        )
      }}
    >
      <CAHPlayableWhiteCard card={props.card} />
    </div>
  );
};

export default DragSource(
  cardInPlayQueue,
  {beginDrag: (props: DraggableCardProps) => (props.card)},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(DraggableCard);
