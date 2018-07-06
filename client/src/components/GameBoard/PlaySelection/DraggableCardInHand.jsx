import React, {Component} from 'react';
import DragSource from 'react-dnd/lib/DragSource';
import CAHWhiteCard from '../../shells/CAHWhiteCard.jsx';
import {cardInPlayQueue} from '../../../dndTypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {queueCard} from '../../../store/modules/game';
import {canPlay} from '../../../store';

@DragSource(
  cardInPlayQueue,
  {beginDrag: (props) => ({cardId: props.card.id})},
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)
class DraggableCard extends Component {
  render() {
    const {whitePlayed, currentBlackCard, currentUser, judgeId} = this.props;
    return this.props.connectDragSource(
      <div
        onClick={() => (
          canPlay({whitePlayed, currentBlackCard, currentUser, judgeId}) &&
          this.props.queueCard({cardId: this.props.card.id})
        )}
        style={{
          opacity: (this.props.isDragging ||
            !canPlay({
              whitePlayed,
              currentBlackCard,
              currentUser,
              judgeId
            }) ? 0.5 : 1
          )
        }}
      >
        <CAHWhiteCard {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = ({game: {whitePlayed, currentBlackCard, judgeId}, user: {currentUser}}) => ({
  whitePlayed,
  currentBlackCard,
  currentUser,
  judgeId
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  queueCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DraggableCard);
