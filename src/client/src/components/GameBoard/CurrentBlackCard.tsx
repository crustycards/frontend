import {Typography} from '@material-ui/core';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {removeAdjacentDuplicateCharacters} from '../../helpers/string';
import {StoreState} from '../../store';
import CAHBlackCard from '../shells/CAHBlackCard';

const parseCardText = (blackCardText: string, whiteCardTextList: string[]) => {
  const replacementIndicator = '_';

  // Reduce all long underscore chains
  blackCardText = removeAdjacentDuplicateCharacters(blackCardText, replacementIndicator);

  // Remove single periods at the end of white card text
  for (const i in whiteCardTextList) {
    // ... shouldn't be reduced to ..
    if (!whiteCardTextList[i] || whiteCardTextList[i].endsWith('..')) {
      continue;
    }

    if (whiteCardTextList[i].endsWith('.')) {
      // Remove period at the end
      whiteCardTextList[i] = whiteCardTextList[i].slice(0, whiteCardTextList[i].length - 1);
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

const CurrentBlackCard = () => {
  const {card, hand, queuedCardIds} = useSelector(({game}: StoreState) => ({
    card: game.currentBlackCard,
    hand: game.hand,
    queuedCardIds: game.queuedCardIds
  }));

  return card ?
    <CAHBlackCard
      card={{
        ...card,
        text: parseCardText(card.text, queuedCardIds.map((id) =>
          (id ? hand.find((card) => card.id === id).text : null)
        ))
      }}
    />
    :
    <CAHBlackCard hideAnswerCount card={{text: 'GAME NOT RUNNING', id: null, answerFields: null, cardpackId: null}} />;
};

export default CurrentBlackCard;
