import * as React from 'react';
import {BlackCardInRound} from '../../../../../proto-gen-out/api/game_service_pb';
import CAHCustomBlackCard from './CAHCustomBlackCard';
import CAHDefaultBlackCard from './CAHDefaultBlackCard';

interface CAHBlackCardInRoundProps {
  card: BlackCardInRound;
  hideAnswerCount?: boolean;
  overrideTextElements?: (string | JSX.Element)[];
}

const CAHBlackCardInRound = (props: CAHBlackCardInRoundProps) => {
  const customBlackCard = props.card.getCustomBlackCard();
  if (customBlackCard) {
    return (
      <CAHCustomBlackCard
        card={customBlackCard}
        hideAnswerCount={props.hideAnswerCount}
        overrideTextElements={props.overrideTextElements}
      />
    );
  }

  const defaultBlackCard = props.card.getDefaultBlackCard();
  if (defaultBlackCard) {
    return (
      <CAHDefaultBlackCard
        card={defaultBlackCard}
        hideAnswerCount={props.hideAnswerCount}
        overrideTextElements={props.overrideTextElements}
      />
    );
  }

  // TODO - Add default case.
  return <div>Invalid card.</div>;
};

export default CAHBlackCardInRound;
