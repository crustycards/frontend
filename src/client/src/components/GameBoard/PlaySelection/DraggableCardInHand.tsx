import * as React from 'react';
import {Component} from 'react';
import { ConnectDragSource } from 'react-dnd';
import DragSource from 'react-dnd/lib/DragSource';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {BlackCard, User, WhiteCard, WhitePlayed} from '../../../api/dao';
import {cardInPlayQueue} from '../../../dndTypes';
import {canPlay} from '../../../store';
import {queueCard} from '../../../store/modules/game';
import CAHWhiteCard from '../../shells/CAHWhiteCard';

// TODO - Remove ?'s from DraggableCardProps properties and fix react-dnd typescript issues
interface DraggableCardProps {
  card: WhiteCard;
  whitePlayed: WhitePlayed;
  currentBlackCard: BlackCard;
  user: User;
  judgeId: string;
  isDragging?: boolean;
  connectDragSource?: ConnectDragSource;
  queueCard(data: {cardId: string}): void;
}

@DragSource(
  cardInPlayQueue,
  {beginDrag: (props: DraggableCardProps) => ({cardId: props.card.id})},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)
class DraggableCard extends Component<DraggableCardProps> {
  public render() {
    const {card, whitePlayed, currentBlackCard, user, judgeId, isDragging} = this.props;
    return this.props.connectDragSource(
      <div
        onClick={() => (
          canPlay({whitePlayed, currentBlackCard, user, judgeId}) &&
          this.props.queueCard({cardId: this.props.card.id})
        )}
        style={{
          opacity: (isDragging ||
            !canPlay({
              whitePlayed,
              currentBlackCard,
              user,
              judgeId
            }) ? 0.5 : 1
          )
        }}
      >
        <CAHWhiteCard card={card} />
      </div>
    );
  }
}

const mapStateToProps = ({
  game: {
    whitePlayed,
    currentBlackCard,
    judgeId
  },
  global: {
    user
  }
}: any) => ({
  whitePlayed,
  currentBlackCard,
  user,
  judgeId
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  queueCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DraggableCard);
