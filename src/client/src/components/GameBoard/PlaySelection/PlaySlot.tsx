import * as React from 'react';
import {Component} from 'react';
import {ConnectDropTarget, DropTarget} from 'react-dnd/lib';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {LocalGameData, WhiteCard} from '../../../api/dao';
import {cardInHand, cardInPlayQueue} from '../../../dndTypes';
import {queueCard, unqueueCard} from '../../../store/modules/game';
import DraggableCardInPlayQueue from './DraggableCardInPlayQueue';

interface PlaySlotProps {
  index: number;
  queuedCardIds: string[];
  cards: WhiteCard[];
  connectDropTarget?: ConnectDropTarget;
  queueCard: ({index, cardId}: {index: number, cardId: string}) => void;
  unqueueCard: (cardId: string) => void;
}

class PlaySlot extends Component<PlaySlotProps> {
  public render() {
    if (this.props.queuedCardIds[this.props.index]) {
      const card = this.props.cards.find(
        (card) => card.id === this.props.queuedCardIds[this.props.index]
      );
      return this.props.connectDropTarget(
        <div>
          <DraggableCardInPlayQueue
            key={card.id}
            card={card}
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

const mapStateToProps = ({game}: {game: LocalGameData}) => ({
  cards: game.hand,
  queuedCardIds: game.queuedCardIds
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  queueCard,
  unqueueCard
}, dispatch);

const DropTargetPlaySlot = DropTarget([cardInHand, cardInPlayQueue], {drop: (props: PlaySlotProps, monitor) => {
  props.queueCard({index: props.index, cardId: monitor.getItem().cardId});
}}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(PlaySlot);
export default connect(mapStateToProps, mapDispatchToProps)(DropTargetPlaySlot);
