import React, { Component } from 'react';
import { DropTarget } from 'react-dnd/lib';
import { playableCard } from '../../dndTypes';

class PlayArea extends Component {
  render() {
    const { connectDropTarget, canDrop, isOver } = this.props;
    return connectDropTarget(<div>Play Area</div>);
  }
}

export default DropTarget(playableCard, {}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(PlayArea);