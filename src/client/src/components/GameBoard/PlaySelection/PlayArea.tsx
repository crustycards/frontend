import * as React from 'react';
import {connect} from 'react-redux';
import { BlackCard, LocalGameData } from '../../../api/dao';
import PlaySlot from './PlaySlot';

interface PlayAreaProps {
  currentBlackCard: BlackCard;
}

const PlayArea = ({currentBlackCard}: PlayAreaProps) => {
  const elems = [];
  for (let i = 0; i < currentBlackCard.answerFields; i++) {
    elems.push(<PlaySlot index={i} key={i}/>);
  }
  return <div>{elems}</div>;
};

const mapStateToProps = ({game}: {game: LocalGameData}) => ({
  currentBlackCard: game.currentBlackCard
});

export default connect(mapStateToProps)(PlayArea);
