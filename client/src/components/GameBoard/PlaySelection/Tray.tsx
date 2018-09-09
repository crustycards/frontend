import * as React from 'react';
import {Component} from 'react';
import DraggableCardInHand from './DraggableCardInHand';
import {cardInHand} from '../../../dndTypes';
import {DropTarget, ConnectDropTarget} from 'react-dnd/lib';
import {connect} from 'react-redux';
import {canPlay} from '../../../store';
import {unqueueCard} from '../../../store/modules/game';
import {bindActionCreators, Dispatch} from 'redux';
import {WhiteCard, User, WhitePlayed, BlackCard} from '../../../api/dao';

interface TrayProps {
  unqueueCard(cardId: string): void
  cards: WhiteCard[]
  queuedCardIds: string[]
  connectDropTarget?: ConnectDropTarget // TODO - Remove '?' and fix react-dnd types
  whitePlayed: WhitePlayed
  currentBlackCard: BlackCard
  user: User
  judgeId: string
}

@DropTarget(cardInHand, {drop: (props: TrayProps, monitor) => {
  props.unqueueCard(monitor.getItem().cardId);
}}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class Tray extends Component<TrayProps> {
  render() {
    const {
      cards,
      queuedCardIds,
      connectDropTarget,
      whitePlayed,
      currentBlackCard,
      user,
      judgeId
    } = this.props;

    return connectDropTarget(
      <div
        className='tray'
        style={{
          minHeight: '100px',
          backgroundColor: canPlay({
            whitePlayed,
            currentBlackCard,
            user,
            judgeId
          }) ? 'inherit' : 'grey'
        }}
      >
        {cards.filter((card) => !queuedCardIds.includes(card.id)).map((card) =>
          <DraggableCardInHand
            key={card.id}
            card={card}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({
  game: {
    hand,
    queuedCardIds,
    whitePlayed,
    currentBlackCard,
    judgeId
  },
  global: {
    user
  }
}: any) => ({
  cards: hand,
  queuedCardIds,
  whitePlayed,
  currentBlackCard,
  user,
  judgeId
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  unqueueCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Tray);
