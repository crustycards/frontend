import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import { Star } from 'material-ui-icons';

const styles = {
  overflowY: 'scroll',
  maxHeight: '300px',
  maxWidth: '200px'
};

const PlayerList = ({players}) => (
  <List style={styles}>
    {players.map((player, index) => {
      return <ListItem key={index} primaryText={player.name} secondaryText={player.email}/>
    })}
  </List>
);

const mapStateToProps = ({global}) => ({
  players: global.currentGame.players
});

export default connect(mapStateToProps)(PlayerList);