import {Typography} from '@material-ui/core';
import * as React from 'react';
import {BlackCard} from '../../../../../proto-gen-out/api/model_pb';
import {PlayableWhiteCard} from '../../../../../proto-gen-out/game/game_service_pb';
import {removeAdjacentDuplicateCharacters} from '../../helpers/string';
import {getDisplayTextForPlayableWhiteCard} from '../../helpers/proto';
import {queuedCardIdPointsToPlayableCard} from '../../store/modules/game';
import CAHBlackCard from '../shells/CAHBlackCard';
import {QueuedCardId} from '../../store/modules/game';

const parseCardText = (
  blackCardText: string,
  whiteCardTextList: string[]): (string | JSX.Element)[] => {
  const replacementIndicator = '_';

  // Reduce all long underscore chains
  blackCardText = removeAdjacentDuplicateCharacters(
    blackCardText, replacementIndicator);

  // Remove single periods at the end of white card text
  for (const i in whiteCardTextList) {
    // ... shouldn't be reduced to ..
    if (!whiteCardTextList[i] || whiteCardTextList[i].endsWith('..')) {
      continue;
    }

    if (whiteCardTextList[i].endsWith('.')) {
      // Remove period at the end
      whiteCardTextList[i] = whiteCardTextList[i]
        .slice(0, whiteCardTextList[i].length - 1);
    }
  }

  const splitBlackText = blackCardText.split(replacementIndicator);
  const injectedBlackTextElements = [];

  for (let i = 0; i < splitBlackText.length - 1; i++) {
    injectedBlackTextElements.push(splitBlackText[i]);
    if (whiteCardTextList[i]) {
      injectedBlackTextElements.push(
        <Typography
          key={i}
          style={{display: 'inline'}}
          variant={'h6'}
          component={'div'}
          color={'secondary'}
        >
          {whiteCardTextList[i]}
        </Typography>
      );
    } else {
      injectedBlackTextElements.push('_____');
    }
  }
  injectedBlackTextElements.push(splitBlackText[splitBlackText.length - 1]);

  return injectedBlackTextElements;
};

interface CurrentBlackCardProps {
  currentBlackCard?: BlackCard;
  hand: PlayableWhiteCard[];
  queuedCardIds: (QueuedCardId | null)[];
}

const CurrentBlackCard = (props: CurrentBlackCardProps) => {
  if (!props.currentBlackCard) {
    const gameNotRunningCard = new BlackCard();
    gameNotRunningCard.setText('GAME NOT RUNNING');
    return <CAHBlackCard hideAnswerCount card={gameNotRunningCard} />;
  }

  const overrideTextElements = parseCardText(
    props.currentBlackCard.getText(),
    props.queuedCardIds.map((queuedCardId) => {
      const cardInHand = props.hand.find((card) =>
        queuedCardIdPointsToPlayableCard(queuedCardId, card));
      return cardInHand ? getDisplayTextForPlayableWhiteCard(cardInHand) : 'Unknown Card';
    })
  );

  return (
    <CAHBlackCard
      card={props.currentBlackCard}
      overrideTextElements={overrideTextElements}
    />
  );
};

export default CurrentBlackCard;
