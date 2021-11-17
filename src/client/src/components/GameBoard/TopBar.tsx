import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Toolbar,
  Typography
} from '@mui/material';
import {createStyles, makeStyles} from '@material-ui/styles';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {GameView, PastRound} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import ViewPastRoundsDialog from './ViewPastRoundsDialog';
import {User} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {GameService} from '../../api/gameService';

const buttonStyle = {
  height: '36px',
  margin: '15px',
  width: 'auto'
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  topBar: {
    backgroundColor: theme.palette.secondary.main,
    margin: '8px 0'
  }
}));

interface TopBarProps {
  gameService: GameService;
  pastRounds: PastRound[];
  displayName: string;
  owner: User | undefined;
  gameStage: GameView.Stage;
}

const TopBar = (props: TopBarProps) => {
  const [showPastRoundsDialog, setShowPastRoundsDialog] = useState(false);
  const [
    showLeaveGameConfirmationDialog,
    setShowLeaveGameConfirmationDialog
  ] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  return <AppBar className={classes.topBar} position={'static'}>
    <Toolbar style={{padding: 0}}>
      <div style={{height: '66px', float: 'left'}}>
        <Typography style={{lineHeight: '36px', margin: '0 10px', fontSize: '1.2em'}}>
          {`Current game:  ${props.displayName}`}
        </Typography>
        <Typography
          style={{
            float: 'left',
            lineHeight: '30px',
            margin: '0 10px',
            fontSize: '1em'
          }}
        >
          {`Owner: ${props.owner?.getDisplayName() || 'Unknown'}`}
        </Typography>
      </div>
      <div style={{flex: 1}}></div> {/* Pushes buttons to right edge */}
      <div style={{float: 'right'}}>
        <Button
            color={'primary'}
            variant={'contained'}
            onClick={() => setShowPastRoundsDialog(!showPastRoundsDialog)}
            style={buttonStyle}
        >
          Past Rounds
        </Button>
        <ViewPastRoundsDialog
          pastRounds={props.pastRounds}
          open={showPastRoundsDialog}
          onClose={() => setShowPastRoundsDialog(false)}
        />
        {
          props.gameStage === GameView.Stage.ROUND_END_PHASE &&
          <Button
            color={'primary'}
            variant={'contained'}
            onClick={props.gameService.voteStartNextRound}
            style={buttonStyle}
          >
            Next Round
          </Button>
        }
        <Button
          color={'primary'}
          variant={'contained'}
          onClick={() => setShowLeaveGameConfirmationDialog(true)}
          style={buttonStyle}
        >
          Leave Game
        </Button>
        <Dialog
          open={showLeaveGameConfirmationDialog}
          onClose={() => setShowLeaveGameConfirmationDialog(false)}
        >
          <DialogTitle>Leave Game</DialogTitle>
          <DialogContent>Are you sure you want to leave?</DialogContent>
          <DialogActions>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={
                () => props.gameService.leaveGame()
                  .then(() => dispatch(push('/gamelist')))
              }
            >
              Yes
            </Button>
            <Button
              variant={'outlined'}
              onClick={() => setShowLeaveGameConfirmationDialog(false)}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Toolbar>
  </AppBar>;
};

export default TopBar;
