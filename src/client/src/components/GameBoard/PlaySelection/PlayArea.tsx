import * as React from 'react';
import {useSelector} from 'react-redux';
import {StoreState} from '../../../store';
import PlaySlot from './PlaySlot';

const PlayArea = () => {
  const {currentBlackCard} = useSelector(({game: {currentBlackCard}}: StoreState) => ({currentBlackCard}));
  const elems = [];
  for (let i = 0; i < currentBlackCard.answerFields; i++) {
    elems.push(<PlaySlot index={i} key={i}/>);
  }
  return <div>{elems}</div>;
};

export default PlayArea;
