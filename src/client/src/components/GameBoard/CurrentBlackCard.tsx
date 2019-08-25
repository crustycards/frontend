import {Typography} from '@material-ui/core';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {StoreState} from '../../store';
import CAHBlackCard from '../shells/CAHBlackCard';

const parseCardText = (blackCardText: string, whiteCardTextList: string[]) => {
  let tempText = blackCardText;
  const tempWhiteTexts = [...whiteCardTextList];

  const replacementIndicator = '_____';

  while (true) {
    const reducedUnderscoreText = tempText.replace(
      replacementIndicator + '_',
      replacementIndicator
    );
    if (reducedUnderscoreText === tempText) {
      break;
    } else {
      tempText = reducedUnderscoreText;
    }
  }

  for (const i in tempWhiteTexts) {
    // TODO - Don't remove period if card ends in multiple ...'s
    // TODO - handle underscored wrapped in quotation marks
    if (tempWhiteTexts[i] && tempWhiteTexts[i].endsWith('.')) {
      tempWhiteTexts[i] = tempWhiteTexts[i].slice(0, tempWhiteTexts[i].length - 1);
    }
  }

  const splitBlackText = tempText.split(replacementIndicator);
  const injectedBlackTextElements = [];

  for (let i = 0; i < splitBlackText.length - 1; i++) {
    injectedBlackTextElements.push(splitBlackText[i]);
    if (tempWhiteTexts[i]) {
      injectedBlackTextElements.push(
        <Typography
          key={i}
          style={{display: 'inline'}}
          variant={'h6'}
          component={'div'}
          color={'secondary'}
        >
          {tempWhiteTexts[i]}
        </Typography>
      );
    } else {
      injectedBlackTextElements.push(replacementIndicator);
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
