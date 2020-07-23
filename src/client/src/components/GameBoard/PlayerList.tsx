import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography
} from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import Star from '@material-ui/icons/Star';
import * as React from 'react';
import {GameView, Player} from '../../../../../proto-gen-out/game/game_service_pb';
import {getPlayerDisplayName, playersAreEqual} from '../../helpers/proto';
import {useGlobalStyles} from '../../styles/globalStyles';

const styles: React.CSSProperties = {
  overflowY: 'auto',
  maxHeight: '100%',
  padding: 0
};

const hasPlayed = (player: Player, game: GameView): boolean => {
  const playerEntry = game.getWhitePlayedList().find((entry) => (
    entry.hasPlayer() && playersAreEqual(entry.getPlayer(), player)
  ));
  return !!(playerEntry?.getCardTextsList().length);
};

const renderPlayer = (
  player: Player,
  ownerName: string | undefined,
  judgeName: string | undefined,
  hasPlayed: boolean) => {
  if (player.hasUser()) {
    // TODO - Render game owner uniquely
    let playerIcon;
    if (judgeName === player.getUser()?.getName()) {
      playerIcon = <Star/>;
    } else if (hasPlayed) {
      playerIcon = <Check/>;
    }
    return (
      <ListItem>
        <ListItemText
          primary={
            <Typography color={'textPrimary'}>
              {getPlayerDisplayName(player)}
            </Typography>
          }
          secondary={`Score: ${player.getScore()}`}
        />
        {playerIcon &&
          <ListItemIcon>
            {playerIcon}
          </ListItemIcon>
        }
      </ListItem>
    );
  }

  if (player.hasArtificialUser()) {
    return (
      <ListItem>
        <ListItemText
          primary={
            <Typography color={'textPrimary'}>
              {getPlayerDisplayName(player)}
            </Typography>
          }
          secondary={`Score: ${player.getScore()}`}
        />
      </ListItem>
    );
  }

  throw Error('Player must contain user or artificial_user property.');
};

const renderQueuedPlayer = (player: Player) => (
  <ListItem disabled>
    <ListItemText
      primary={
        <Typography color={'textPrimary'}>
          {getPlayerDisplayName(player)}
        </Typography>
      }
    />
  </ListItem>
);

interface PlayerListProps {
  gameView: GameView;
}

const PlayerList = (props: PlayerListProps) => {
  const realPlayers =
    props.gameView.getPlayersList().filter((player) => player.hasUser());

  const artificialPlayers =
    props.gameView.getPlayersList()
      .filter((player) => player.hasArtificialUser());

  const queuedRealPlayers =
    props.gameView.getQueuedPlayersList().filter((player) => player.hasUser());

  const queuedArtificialPlayers =
    props.gameView.getQueuedPlayersList()
      .filter((player) => player.hasArtificialUser());

  const ownerName = props.gameView.getOwner()?.getName();
  const judgeName = props.gameView.getJudge()?.getName();

  const globalClasses = useGlobalStyles();

  return (
    <div>
      {
        !!realPlayers.length &&
          <div className={globalClasses.panel}>
            <List
              subheader={<ListSubheader>Players</ListSubheader>}
              style={styles}
            >
              {realPlayers.map((player, index) => {
                return (<div key={index}>
                  {renderPlayer(
                    player,
                    ownerName,
                    judgeName,
                    hasPlayed(player, props.gameView)
                  )}
                </div>);
              }).concat(queuedRealPlayers.map((player, index) =>
                <div key={index + realPlayers.length}>
                  {renderQueuedPlayer(player)}
                </div>
              ))}
            </List>
          </div>
      }
      {
        !!artificialPlayers.length &&
          <div className={globalClasses.panel}>
            <List
              subheader={<ListSubheader>Artificial Players</ListSubheader>}
              style={styles}
            >
              {artificialPlayers.map((player, index) => {
                return (<div key={index}>
                  {renderPlayer(
                    player,
                    ownerName,
                    judgeName,
                    hasPlayed(player, props.gameView)
                  )}
                </div>);
              }).concat(queuedArtificialPlayers.map((player, index) =>
                <div key={index + artificialPlayers.length}>
                  {renderQueuedPlayer(player)}
                </div>
              ))}
            </List>
          </div>
      }
    </div>
  );
};

export default PlayerList;
