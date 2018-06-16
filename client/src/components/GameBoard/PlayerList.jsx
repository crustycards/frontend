import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import { Star, Check } from 'material-ui-icons';

const styles = {
  overflowY: 'auto',
  maxHeight: '100%',
  padding: 0
};

// TODO - Render game owner uniquely

const renderPlayer = (player, ownerId, judgeId, hasPlayed) => {
  if (player.id === ownerId && player.id === judgeId) {
    return <ListItem rightIcon={<Star/>} primaryText={player.name} secondaryText={`Score: ${player.score}`}/>;
  } else if (player.id === judgeId) {
    return <ListItem rightIcon={<Star/>} primaryText={player.name} secondaryText={`Score: ${player.score}`}/>;
  } else if (player.id === ownerId) {
    return <ListItem rightIcon={hasPlayed ? <Check/> : null} primaryText={player.name} secondaryText={`Score: ${player.score}`}/>;
  } else {
    return <ListItem rightIcon={hasPlayed ? <Check/> : null} primaryText={player.name} secondaryText={`Score: ${player.score}`}/>;
  }
};

const renderQueuedPlayer = (player) => (
  <ListItem disabled={true} primaryText={player.name}/>
);

const PlayerList = ({players, queuedPlayers, ownerId, judgeId, whitePlayed, currentBlackCard}) => (
  <List style={styles}>
    {players.map((player, index) => {
      return <div key={index}>{renderPlayer(player, ownerId, judgeId, whitePlayed && whitePlayed[player.id] && currentBlackCard && whitePlayed[player.id].length === currentBlackCard.answerFields)}</div>;
    }).concat(queuedPlayers.map((player, index) => <div key={index + players.length}>{renderQueuedPlayer(player)}</div>))}
  </List>
);

const mapStateToProps = ({game}) => ({
  players: game.players,
  queuedPlayers: game.queuedPlayers,
  ownerId: game.ownerId,
  judgeId: game.judgeId,
  whitePlayed: game.whitePlayed,
  currentBlackCard: game.currentBlackCard
});

export default connect(mapStateToProps)(PlayerList);