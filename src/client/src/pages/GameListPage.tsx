import {Divider} from '@material-ui/core';
import * as React from 'react';
import GameCreator from '../components/GameList/GameCreator';
import GameList from '../components/GameList/GameList';
import {useGameService, useUserService} from '../api/context';
import {StoreState} from '../store';
import {useSelector} from 'react-redux';
import {useGlobalStyles} from '../styles/globalStyles';

const GameListPage = () => {
  const gameService = useGameService();
  const userService = useUserService();
  const {
    currentUser,
    currentUserSettings
  } = useSelector(({global: {user, userSettings}}: StoreState) => ({
    currentUser: user,
    currentUserSettings: userSettings
  }));

  const globalClasses = useGlobalStyles();

  if (!gameService || !currentUser || !currentUserSettings) {
    return (
      <div className={globalClasses.contentWrap}>
        <div className={globalClasses.panel}>
          <div>Must be logged in to view games.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={globalClasses.contentWrap}>
      <div className={globalClasses.panel}>
        <GameCreator
          gameService={gameService}
          userService={userService}
          currentUser={currentUser}
          quickStartGameConfig={currentUserSettings.getQuickStartGameConfig()}
        />
        <Divider style={{marginTop: '10px', marginBottom: '10px'}} />
        <GameList gameService={gameService}/>
      </div>
    </div>
  );
};

export default GameListPage;
