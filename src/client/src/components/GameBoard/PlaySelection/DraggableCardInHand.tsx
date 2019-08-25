import * as React from 'react';
import {ConnectDragSource, DragSource} from 'react-dnd';
import {useDispatch, useSelector} from 'react-redux';
import {User, WhiteCard} from '../../../api/dao';
import {cardInPlayQueue} from '../../../dndTypes';
import {canPlay, StoreState} from '../../../store';
import {queueCard} from '../../../store/modules/game';
import CAHWhiteCard from '../../shells/CAHWhiteCard';

interface DraggableCardProps {
  card: WhiteCard;
  connectDragSource: ConnectDragSource;
  isDragging: boolean;
}

const DraggableCard = (props: DraggableCardProps) => {
  const {game, user} = useSelector(({game, global: {user}}: StoreState) => ({game, user}));
  const {whitePlayed, currentBlackCard, judgeId} = game;
  const dispatch = useDispatch();

  return props.connectDragSource(
    <div
      onClick={() => (
        canPlay({whitePlayed, currentBlackCard, user, judgeId}) &&
        dispatch(queueCard({cardId: props.card.id}))
      )}
      style={{
        opacity: (props.isDragging ||
          !canPlay({
            whitePlayed,
            currentBlackCard,
            user,
            judgeId
          }) ? 0.5 : 1
        )
      }}
    >
      <CAHWhiteCard card={props.card} />
    </div>
  );
};

export default DragSource(
  cardInPlayQueue,
  {beginDrag: (props: DraggableCardProps) => ({cardId: props.card.id})},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(DraggableCard);
