import React from 'react';
import CAHBlackCard from '../shells/CAHBlackCard.jsx';
import { connect } from 'react-redux';

const parseCardText = (blackCardText, whiteCardTextList) => {
  let tempText = blackCardText;

  const replacementIndicator = '_____';
  for (let i = 0; i < whiteCardTextList.length && tempText.includes(replacementIndicator); i++) {
    tempText = tempText.replace(replacementIndicator, whiteCardTextList[i]);
  }

  return tempText;
};

const CurrentBlackCard = ({card, hand, queuedCardIds}) => (
  card ?
    <CAHBlackCard card={{...card, text: parseCardText(card.text, queuedCardIds.map(id => hand.find(card => card.id === id).text))}} />
    :
    <div>No Black Card</div>
);

const mapStateToProps = ({game}) => ({
  card: game.currentBlackCard,
  hand: game.hand,
  queuedCardIds: game.queuedCardIds
});

export default connect(mapStateToProps)(CurrentBlackCard);