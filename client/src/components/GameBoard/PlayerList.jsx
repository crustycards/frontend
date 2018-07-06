import React from 'react';
import {connect} from 'react-redux';
import {List, ListItem, ListItemText, ListItemIcon, ListSubheader} from '@material-ui/core';
import {Star, Check} from '@material-ui/icons';

const styles = {
  overflowY: 'auto',
  maxHeight: '100%',
  padding: 0
};

// TODO - Render game owner uniquely

const renderPlayer = (player, ownerId, judgeId, hasPlayed) => {
  if (player.id === ownerId && player.id === judgeId) {
    return (
      <ListItem>
        <ListItemText
          primary={player.name}
          secondary={`Score: ${player.score}`}
        />
        <ListItemIcon>
          <Star style={{float: 'right'}} />
        </ListItemIcon>
      </ListItem>
    );
  } else if (player.id === judgeId) {
    return (
      <ListItem>
        <ListItemText
          primary={player.name}
          secondary={`Score: ${player.score}`}
        />
        <ListItemIcon>
          <Star style={{float: 'right'}} />
        </ListItemIcon>
      </ListItem>
    );
  } else if (player.id === ownerId) {
    return (
      <ListItem>
        <ListItemText
          primary={player.name}
          secondary={`Score: ${player.score}`}
        />
        {hasPlayed && <ListItemIcon><Check/></ListItemIcon>}
      </ListItem>
    );
  } else {
    return (
      <ListItem>
        <ListItemText
          primary={player.name}
          secondary={`Score: ${player.score}`}
        />
        {hasPlayed && <ListItemIcon><Check/></ListItemIcon>}
      </ListItem>
    );
  }
};

const renderQueuedPlayer = (player) => (
  <ListItem disabled>
    <ListItemText
      primary={player.name}
      secondary={`Score: ${player.score}`}
    />
  </ListItem>
);

const PlayerList = ({players, queuedPlayers, ownerId, judgeId, whitePlayed, currentBlackCard}) => (
  <div className={'panel'}>
    <List subheader={<ListSubheader>Players</ListSubheader>} style={styles}>
      {players.map((player, index) => {
        return <div key={index}>{renderPlayer(player, ownerId, judgeId, whitePlayed && whitePlayed[player.id] && currentBlackCard && whitePlayed[player.id].length === currentBlackCard.answerFields)}</div>;
      }).concat(queuedPlayers.map((player, index) => <div key={index + players.length}>{renderQueuedPlayer(player)}</div>))}
    </List>
  </div>
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
