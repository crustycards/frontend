import * as React from 'react';
import {Component} from 'react';
import {DropTarget, ConnectDropTarget} from 'react-dnd/lib';
import {cardInHand, cardInPlayQueue} from '../../../dndTypes';
import {connect} from 'react-redux';
import DraggableCardInPlayQueue from './DraggableCardInPlayQueue.jsx';
import {bindActionCreators, Dispatch} from 'redux';
import {queueCard, unqueueCard} from '../../../store/modules/game';
import { LocalGameData, WhiteCard } from '../../../api/dao';

interface ReducedPlaySlotProps {
  index: number
  queuedCardIds: string[]
  cards: WhiteCard[]
  queueCard: ({index, cardId}: {index: number, cardId: string}) => void
  unqueueCard: (cardId: string) => void
}

interface PlaySlotProps extends ReducedPlaySlotProps {
  connectDropTarget: ConnectDropTarget
}

@DropTarget([cardInHand, cardInPlayQueue], {drop: (props: PlaySlotProps, monitor) => {
  props.queueCard({index: props.index, cardId: monitor.getItem().cardId});
}}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class PlaySlot extends Component<PlaySlotProps> {
  render() {
    if (this.props.queuedCardIds[this.props.index]) {
      const card = this.props.cards.find(
        (card) => card.id === this.props.queuedCardIds[this.props.index]
      );
      return this.props.connectDropTarget(
        <div>
          <DraggableCardInPlayQueue
            key={card.id}
            card={card}
            onDrop={() => this.props.unqueueCard(card.id)}
          />
        </div>
      );
    } else {
      return this.props.connectDropTarget(
        <div
          className={'panel'}
          style={{
            textAlign: 'center',
            borderStyle: 'dotted',
            padding: '10px',
            margin: '5px 0'
          }}
        >
          Drop a card here
        </div>
      );
    }
  }
}

const DnDPlaySlot = DropTarget([cardInHand, cardInPlayQueue], {drop: (props: ReducedPlaySlotProps, monitor) => {
  props.queueCard({index: props.index, cardId: monitor.getItem().cardId});
}}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(PlaySlot);

const mapStateToProps = ({game}: {game: LocalGameData}) => ({
  cards: game.hand,
  queuedCardIds: game.queuedCardIds
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  queueCard,
  unqueueCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DnDPlaySlot);
