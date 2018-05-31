import React from 'react';
import { connect } from 'react-redux';
import WhiteCard from '../shells/CAHWhiteCard.jsx';
import { vote } from '../../gameServerInterface';
import { RaisedButton } from 'material-ui';

const PlayedCards = (props) => {
  return (
    <div className={'panel'}>
      {props.game.whitePlayedAnonymous && props.game.whitePlayedAnonymous.map((cards, index) => <div className={'subpanel'} key={index}>{cards.map((card, index) => <WhiteCard card={card} key={index} />)}{props.currentUser.id === props.game.judgeId && <RaisedButton label={'Vote'} onClick={() => { vote(cards[0].id); }} />}</div>)}
      {!props.game.whitePlayedAnonymous && Object.keys(props.game.whitePlayed).map((userId, index) => <div className={'subpanel'} key={index}><b>{props.game.players.find(player => player.id === userId).name}</b>{props.game.whitePlayed[userId].map((f, index) => <WhiteCard card={{text: '_____'}} key={index} />)}</div>)}
    </div>
  );
};

const mapStateToProps = ({game, user: {currentUser}}) => ({game, currentUser});

export default connect(mapStateToProps)(PlayedCards);