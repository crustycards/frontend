import {List, ListItem, ListItemIcon, ListItemText, ListSubheader} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Star from '@material-ui/icons/Star';
import * as React from 'react';
import {connect} from 'react-redux';
import { BlackCard, LocalGameData, Player, WhitePlayed } from '../../api/dao';

const styles: React.CSSProperties = {
  overflowY: 'auto',
  maxHeight: '100%',
  padding: 0
};

// TODO - Render game owner uniquely

const renderPlayer = (player: Player, ownerId: string, judgeId: string, hasPlayed: boolean) => {
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

const renderQueuedPlayer = (player: Player) => (
  <ListItem disabled>
    <ListItemText
      primary={player.name}
      secondary={`Score: ${player.score}`}
    />
  </ListItem>
);

interface PlayerListProps {
  players: Player[];
  queuedPlayers: Player[];
  ownerId: string;
  judgeId: string;
  whitePlayed: WhitePlayed;
  currentBlackCard: BlackCard;
}

const PlayerList = ({players, queuedPlayers, ownerId, judgeId, whitePlayed, currentBlackCard}: PlayerListProps) => (
  <div className={'panel'}>
    <List subheader={<ListSubheader>Players</ListSubheader>} style={styles}>
      {players.map((player, index) => {
        return (<div key={index}>
          {renderPlayer(
            player,
            ownerId,
            judgeId,
            (
              whitePlayed &&
              whitePlayed[player.id] &&
              currentBlackCard &&
              whitePlayed[player.id].length === currentBlackCard.answerFields
            )
          )}
        </div>);
      }).concat(queuedPlayers.map((player, index) =>
        <div key={index + players.length}>
          {renderQueuedPlayer(player)}
        </div>
      ))}
    </List>
  </div>
);

const mapStateToProps = ({game}: {game: LocalGameData}) => ({
  players: game.players,
  queuedPlayers: game.queuedPlayers,
  ownerId: game.ownerId,
  judgeId: game.judgeId,
  whitePlayed: game.whitePlayed,
  currentBlackCard: game.currentBlackCard
});

export default connect(mapStateToProps)(PlayerList);
