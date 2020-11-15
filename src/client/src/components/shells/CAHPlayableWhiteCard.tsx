import * as React from 'react';
import {PlayableWhiteCard} from '../../../../../proto-gen-out/api/game_service_pb';
import CAHBlankWhiteCard from './CAHBlankWhiteCard';
import CAHWhiteCard from './CAHCustomWhiteCard';
import CAHDefaultWhiteCard from './CAHDefaultWhiteCard';

interface CAHPlayableWhiteCardProps {
  card: PlayableWhiteCard;
}

const CAHPlayableWhiteCard = (props: CAHPlayableWhiteCardProps) => {
  const customWhiteCard = props.card.getCustomWhiteCard();
  if (customWhiteCard) {
    return (<CAHWhiteCard card={customWhiteCard}/>);
  }

  const blankWhiteCard = props.card.getBlankWhiteCard();
  if (blankWhiteCard) {
    return (<CAHBlankWhiteCard card={blankWhiteCard}/>);
  }

  const defaultWhiteCard = props.card.getDefaultWhiteCard();
  if (defaultWhiteCard) {
    return (<CAHDefaultWhiteCard card={defaultWhiteCard}/>);
  }

  throw Error('Card does not contain property custom_white_card, default_white_card, or blank_white_card.');
};

export default CAHPlayableWhiteCard;
