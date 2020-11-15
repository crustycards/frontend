import * as React from 'react';
import PlaySlot from './PlaySlot';
import {GameView} from '../../../../../../proto-gen-out/api/game_service_pb';

interface PlayAreaProps {
  gameView: GameView;
  playSlots: number;
}

const PlayArea = (props: PlayAreaProps) => {
  const elems = [];
  for (let i = 0; i < props.playSlots; i++) {
    elems.push(<PlaySlot gameView={props.gameView} index={i} key={i}/>);
  }
  return <div>{elems}</div>;
};

export default PlayArea;
