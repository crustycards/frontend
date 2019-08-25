import {List, ListItem, ListItemText, ListSubheader} from '@material-ui/core';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {ArtificialPlayer} from '../../api/dao';
import {StoreState} from '../../store';

const styles: React.CSSProperties = {
  overflowY: 'auto',
  maxHeight: '100%',
  padding: 0
};

const renderArtificialPlayer = (player: ArtificialPlayer) => {
  return (
    <ListItem>
      <ListItemText
        primary={player.name}
        secondary={`Score: ${player.score}`}
      />
    </ListItem>
  );
};

const renderQueuedArtificialPlayer = (player: ArtificialPlayer) => (
  <ListItem disabled>
    <ListItemText
      primary={player.name}
      secondary={`Score: ${player.score}`}
    />
  </ListItem>
);

const ArtificialPlayerList = () => {
  const {artificialPlayers, queuedArtificialPlayers} = useSelector(({game}: StoreState) => ({
    artificialPlayers: game.artificialPlayers,
    queuedArtificialPlayers: game.queuedArtificialPlayers
  }));

  return <div className={'panel'}>
    <List subheader={<ListSubheader>Artificial Players</ListSubheader>} style={styles}>
      {artificialPlayers.map((player, index) => {
        return (<div key={index}>
          {renderArtificialPlayer(player)}
        </div>);
      }).concat(queuedArtificialPlayers.map((player, index) =>
        <div key={index + artificialPlayers.length}>
          {renderQueuedArtificialPlayer(player)}
        </div>
      ))}
    </List>
  </div>;
};

export default ArtificialPlayerList;
