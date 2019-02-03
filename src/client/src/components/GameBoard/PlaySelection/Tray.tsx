import * as React from 'react';
import {Component} from 'react';
import {ConnectDropTarget, DropTarget} from 'react-dnd/lib';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {BlackCard, User, WhiteCard, WhitePlayed} from '../../../api/dao';
import {cardInHand} from '../../../dndTypes';
import {canPlay} from '../../../store';
import {unqueueCard} from '../../../store/modules/game';
import DraggableCardInHand from './DraggableCardInHand';

interface TrayProps {
  cards: WhiteCard[];
  queuedCardIds: string[];
  connectDropTarget?: ConnectDropTarget; // TODO - Remove '?' and fix react-dnd types
  whitePlayed: WhitePlayed;
  currentBlackCard: BlackCard;
  user: User;
  judgeId: string;
  unqueueCard(cardId: string): void;
}

class Tray extends Component<TrayProps> {
  public render() {
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
        style={{
          minHeight: '100px',
          width: '100%',
          overflowX: 'scroll',
          display: 'flex',
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

const DropTargetTray = DropTarget(cardInHand, {drop: (props: TrayProps, monitor) => {
  props.unqueueCard(monitor.getItem().cardId);
}}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Tray);
export default connect(mapStateToProps, mapDispatchToProps)(DropTargetTray);
