import * as React from 'react';
import {PlayableWhiteCard} from '../../../../../proto-gen-out/game/game_service_pb';
import CAHBlankWhiteCard from './CAHBlankWhiteCard';
import CAHWhiteCard from './CAHWhiteCard';

interface CAHPlayableWhiteCardProps {
  card: PlayableWhiteCard;
}

const CAHPlayableWhiteCard = (props: CAHPlayableWhiteCardProps) => {
  const whiteCard = props.card.getWhiteCard();
  if (whiteCard) {
    return (<CAHWhiteCard card={whiteCard}/>);
  }

  const blankCard = props.card.getBlankCard();
  if (blankCard) {
    return (<CAHBlankWhiteCard card={blankCard}/>);
  }

  throw Error('Card does not contain property white_card or blank_card.');
};

export default CAHPlayableWhiteCard;
