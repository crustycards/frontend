import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import { Star } from 'material-ui-icons';

const styles = {
  overflowY: 'auto',
  maxHeight: '100%',
  padding: 0
};

// TODO - Render game owner uniquely

let renderPlayer = (player, index, ownerId, judgeId) => {
  if (player.id === ownerId && player.id === judgeId) {
    return <ListItem leftIcon={<Star/>} primaryText={player.name} secondaryText={player.email}/>;
  } else if (player.id === ownerId) {
    return <ListItem primaryText={player.name} secondaryText={player.email}/>;
  } else if (player.id === judgeId) {
    return <ListItem leftIcon={<Star/>} primaryText={player.name} secondaryText={player.email}/>;
  } else {
    return <ListItem primaryText={player.name} secondaryText={player.email}/>;
  }
};

const PlayerList = ({players, ownerId, judgeId}) => (
  <List style={styles}>
    {players.map((player, index) => {
      return <div key={index}>{renderPlayer(player, index, ownerId, judgeId)}</div>;
    })}
  </List>
);

const mapStateToProps = ({game}) => ({
  players: game.players,
  ownerId: game.ownerId,
  judgeId: game.judgeId
});

export default connect(mapStateToProps)(PlayerList);