import {
  Dialog,
  DialogContent,
} from '@material-ui/core';
import * as React from 'react';
import GameCreator from '../components/GameList/GameCreator';
import GameList from '../components/GameList/GameList';
import {useGameService, useUserService} from '../api/context';
import {StoreState} from '../store';
import {useSelector} from 'react-redux';
import {useGlobalStyles} from '../styles/globalStyles';
import {useState} from 'react';

const GameListPage = () => {
  const gameService = useGameService();
  const userService = useUserService();
  const [showCreateGameDialog, setShowCreateGameDialog] = useState(false);
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
        Must be logged in to view games.
      </div>
    );
  }

  return (
    <div className={globalClasses.contentWrap}>
      <Dialog
        open={showCreateGameDialog}
        onClose={() => setShowCreateGameDialog(false)}
        maxWidth={'xl'}
      >
        <DialogContent>
          <GameCreator
            gameService={gameService}
            userService={userService}
            currentUser={currentUser}
            quickStartGameConfig={currentUserSettings.getQuickStartGameConfig()}
          />
        </DialogContent>
      </Dialog>
      <GameList gameService={gameService} openCreateGameDialog={() => setShowCreateGameDialog(true)}/>
    </div>
  );
};

export default GameListPage;
