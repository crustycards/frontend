import {List, ListItem, ListItemIcon, ListItemText, ListSubheader} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Star from '@material-ui/icons/Star';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {Player} from '../../api/dao';
import {StoreState} from '../../store';

const styles: React.CSSProperties = {
  overflowY: 'auto',
  maxHeight: '100%',
  padding: 0
};

const renderPlayer = (player: Player, ownerId: string, judgeId: string, hasPlayed: boolean) => {
  // TODO - Render game owner uniquely
  let playerIcon;
  if (player.id === judgeId) {
    playerIcon = <Star/>;
  } else if (hasPlayed) {
    playerIcon = <Check/>;
  }
  return (
    <ListItem>
      <ListItemText
        primary={player.name}
        secondary={`Score: ${player.score}`}
      />
      {playerIcon &&
        <ListItemIcon>
          {playerIcon}
        </ListItemIcon>
      }
    </ListItem>
  );
};

const renderQueuedPlayer = (player: Player) => (
  <ListItem disabled>
    <ListItemText
      primary={player.name}
      secondary={`Score: ${player.score}`}
    />
  </ListItem>
);

const PlayerList = () => {
  const {game} = useSelector(({game}: StoreState) => ({game}));
  const {
    players,
    queuedPlayers,
    ownerId,
    judgeId,
    whitePlayed,
    currentBlackCard
  } = game;

  return <div className={'panel'}>
    <List subheader={<ListSubheader>Players</ListSubheader>} style={styles}>
      {players.map((player, index) => {
        return (<div key={index}>
          {renderPlayer(
            player,
            ownerId,
            judgeId,
            (
              whitePlayed &&
              whitePlayed.find((entry) => entry.player.user && entry.player.user.id === player.id) &&
              currentBlackCard &&
              whitePlayed.find((entry) => entry.player.user && entry.player.user.id === player.id)
                .cards.length === currentBlackCard.answerFields
            )
          )}
        </div>);
      }).concat(queuedPlayers.map((player, index) =>
        <div key={index + players.length}>
          {renderQueuedPlayer(player)}
        </div>
      ))}
    </List>
  </div>;
};

export default PlayerList;
