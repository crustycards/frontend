import React from 'react'
import { DropTarget } from 'react-dnd/lib'
import { cardInPlayQueue } from '../../../dndTypes'
import { connect } from 'react-redux'
import DraggableCardInPlayQueue from './DraggableCardInPlayQueue.jsx'
import { bindActionCreators } from 'redux'
import { queueCard, unqueueCard } from '../../../store/modules/game'

const PlaySlot = (props) => {
  if (props.queuedCardIds[props.index]) {
    const card = props.cards.find(card => card.id === props.queuedCardIds[props.index])
    return <DraggableCardInPlayQueue
      key={card.id}
      card={card}
      onDrop={() => props.unqueueCard(card.id)}
    />
  } else {
    return props.connectDropTarget(<div style={{textAlign: 'center', borderStyle: 'dotted', padding: '10px', margin: '5px 0'}}>Drop a card here</div>)
  }
}

const DropTargetPlaySlot = DropTarget(cardInPlayQueue, { canDrop: (props, monitor) => { return true }, drop: (props, monitor) => { props.queueCard({index: props.index, cardId: monitor.getItem().cardId}) } }, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(PlaySlot)

const mapStateToProps = ({game}) => ({
  cards: game.hand,
  queuedCardIds: game.queuedCardIds
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  queueCard,
  unqueueCard
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DropTargetPlaySlot)
