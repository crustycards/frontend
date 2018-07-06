import React from 'react';
import CAHBlackCard from '../shells/CAHBlackCard.jsx';
import {Typography} from '@material-ui/core';
import {connect} from 'react-redux';

const parseCardText = (blackCardText, whiteCardTextList) => {
  let tempText = blackCardText;
  const tempWhiteTexts = [...whiteCardTextList];

  const replacementIndicator = '_____';

  while (true) {
    const reducedUnderscoreText = tempText.replace(replacementIndicator + '_', replacementIndicator);
    if (reducedUnderscoreText === tempText) {
      break;
    } else {
      tempText = reducedUnderscoreText;
    }
  }

  for (const i in tempWhiteTexts) {
    // TODO - Don't remove period if card ends in multiple ...'s
    if (tempWhiteTexts[i] && tempWhiteTexts[i].endsWith('.')) {
      tempWhiteTexts[i] = tempWhiteTexts[i].slice(0, tempWhiteTexts[i].length - 1);
    }
  }

  const splitBlackText = tempText.split(replacementIndicator);
  const injectedBlackTextElements = [];

  for (let i = 0; i < splitBlackText.length - 1; i++) {
    injectedBlackTextElements.push(splitBlackText[i]);
    if (tempWhiteTexts[i]) {
      injectedBlackTextElements.push(<Typography key={i} style={{display: 'inline'}} variant={'title'} component={'div'} color={'secondary'}>{tempWhiteTexts[i]}</Typography>);
    } else {
      injectedBlackTextElements.push(replacementIndicator);
    }
  }
  injectedBlackTextElements.push(splitBlackText[splitBlackText.length - 1]);

  return injectedBlackTextElements;
};

const CurrentBlackCard = ({card, hand, queuedCardIds}) => (
  card ?
    <CAHBlackCard card={{...card, text: parseCardText(card.text, queuedCardIds.map((id) => id ? hand.find((card) => card.id === id).text : null))}} />
    :
    <CAHBlackCard hideAnswerCount card={{text: 'GAME NOT RUNNING'}} />
);

const mapStateToProps = ({game}) => ({
  card: game.currentBlackCard,
  hand: game.hand,
  queuedCardIds: game.queuedCardIds
});

export default connect(mapStateToProps)(CurrentBlackCard);
