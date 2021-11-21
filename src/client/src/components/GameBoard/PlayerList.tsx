import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import * as React from 'react';
import {GameView, Player} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {getPlayerDisplayName} from '../../helpers/proto';
import {playerHasPlayed} from '../../store';
import {Panel} from '../../styles/globalStyles';

const styles: React.CSSProperties = {
  overflowY: 'auto',
  maxHeight: '100%',
  padding: 0
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
      playerIcon = <StarIcon/>;
    } else if (hasPlayed) {
      playerIcon = <CheckIcon/>;
    }
    return (
      <ListItem>
        <ListItemText
          primary={
            <Typography>
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
            <Typography>
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
        <Typography>
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

  return (
    <div>
      {
        !!realPlayers.length &&
          <Panel>
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
                    playerHasPlayed(player, props.gameView)
                  )}
                </div>);
              }).concat(queuedRealPlayers.map((player, index) =>
                <div key={index + realPlayers.length}>
                  {renderQueuedPlayer(player)}
                </div>
              ))}
            </List>
          </Panel>
      }
      {
        !!artificialPlayers.length &&
          <Panel>
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
                    playerHasPlayed(player, props.gameView)
                  )}
                </div>);
              }).concat(queuedArtificialPlayers.map((player, index) =>
                <div key={index + artificialPlayers.length}>
                  {renderQueuedPlayer(player)}
                </div>
              ))}
            </List>
          </Panel>
      }
    </div>
  );
};

export default PlayerList;
