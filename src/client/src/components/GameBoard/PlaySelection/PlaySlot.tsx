import * as React from 'react';
import {ConnectDropTarget, DropTarget} from 'react-dnd';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {PlayableWhiteCard, GameView} from '../../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {cardInHand, cardInPlayQueue} from '../../../dndTypes';
import {StoreState} from '../../../store';
import {queueCard} from '../../../store/modules/game';
import {queuedCardIdPointsToPlayableCard} from '../../../store/modules/game';
import DraggableCardInPlayQueue from './DraggableCardInPlayQueue';
import {Panel} from '../../../styles/globalStyles';

interface PlaySlotProps {
  gameView: GameView;
  index: number;
  connectDropTarget: ConnectDropTarget;
  queueCard: ({index, card}: {index: number, card: PlayableWhiteCard}) => void;
}

const PlaySlot = (props: PlaySlotProps) => {
  const {game} = useSelector(({game}: StoreState) => ({game}));

  if (game.queuedCardIds[props.index]) {
    const card = props.gameView.getHandList().find(
      (card) => queuedCardIdPointsToPlayableCard(
        game.queuedCardIds[props.index], card)
    );
    return props.connectDropTarget(
      <div>
        {
          card ?
            <DraggableCardInPlayQueue card={card}/>
            :
            <div>Invalid queued card!</div>
        }
      </div>
    );
  } else {
    return props.connectDropTarget(
      <div>
        <Panel
          style={{
            textAlign: 'center',
            borderStyle: 'dotted',
            padding: '10px',
            margin: '5px 0'
          }}
        >
          Drop a card here
        </Panel>
      </div>
    );
  }
};

const mapDispatchToProps =
(dispatch: Dispatch) => bindActionCreators({queueCard}, dispatch);

const DropTargetPlaySlot = DropTarget(
  [cardInHand, cardInPlayQueue],
  {
    drop: (props: PlaySlotProps, monitor) => {
      props.queueCard({index: props.index, card: monitor.getItem()});
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }))(PlaySlot);

// TODO - Remove `connect` and `mapDispatchToProps` and use React hooks.
export default connect(null, mapDispatchToProps)(DropTargetPlaySlot);
