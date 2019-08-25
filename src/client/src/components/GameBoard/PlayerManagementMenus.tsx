import * as React from 'react';
import {useSelector} from 'react-redux';
import {useApi} from '../../api/context';
import {StoreState} from '../../store';
import UserListMenu from './UserListMenu';

interface MenuProps {
  buttonStyle: React.CSSProperties;
}

export const PlayerKickMenu = (props: MenuProps) => {
  const api = useApi();
  const {game, user} = useSelector(({game, global: {user}}: StoreState) => ({game, user}));

  return <UserListMenu
    buttonText={'Kick'}
    buttonStyle={props.buttonStyle}
    users={game.players.filter((player) => player.id !== user.id)}
    onUserSelect={(userId) => api.game.kickPlayer(userId)}
  />;
};

export const PlayerBanMenu = (props: MenuProps) => {
  const api = useApi();
  const {game, user} = useSelector(({game, global: {user}}: StoreState) => ({game, user}));

  return <UserListMenu
    buttonText={'Ban'}
    buttonStyle={props.buttonStyle}
    users={game.players.filter((player) => player.id !== user.id)}
    onUserSelect={(userId) => api.game.banPlayer(userId)}
  />;
};

export const PlayerUnbanMenu = (props: MenuProps) => {
  const api = useApi();
  const {game} = useSelector(({game}: StoreState) => ({game}));

  return <UserListMenu
    buttonText={'Unban'}
    buttonStyle={props.buttonStyle}
    users={game.bannedPlayers}
    onUserSelect={(userId) => api.game.unbanPlayer(userId)}
  />;
};
