import {Button, Dialog, DialogContent} from '@material-ui/core';
import {ArrowLeft, ArrowRight, KeyboardArrowLeft, KeyboardArrowRight} from '@material-ui/icons';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {StoreState} from '../../store';
import CAHBlackCard from '../shells/CAHBlackCard';
import CAHWhiteCard from '../shells/CAHWhiteCard';

interface ViewPastRoundsDialogProps {
  open: boolean;
  onClose?: () => void;
}

const ViewPastRoundsDialog = (props: ViewPastRoundsDialogProps) => {
  const [roundIndex, setRoundIndex] = React.useState(0);
  const {pastRounds} = useSelector(({game: {pastRounds}}: StoreState) => ({pastRounds}));
  // Since pastRounds can be reset to empty whenever the game is restarted, we need to
  // check at every render to make sure that roundIndex is in bounds. TODO - Fix this by
  // possibly moving the roundIndex to redux state?
  if (roundIndex > 0 && roundIndex >= pastRounds.length) {
    setRoundIndex(pastRounds.length - 1);
  }

  if (!pastRounds.length) {
    return <Dialog open={props.open} onClose={props.onClose}>
      No round are available!
    </Dialog>;
  }

  const canGoToNextRound = roundIndex < pastRounds.length - 1;
  const canGoToPreviousRound = roundIndex > 0;
  const visibleRound = pastRounds[roundIndex];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.keyCode === 37 || e.keyCode === 38) && canGoToPreviousRound) { // Key codes for up/left arrow keys
      setRoundIndex(roundIndex - 1);
    }
    if ((e.keyCode === 39 || e.keyCode === 40) && canGoToNextRound) { // Key codes for down/right arrow keys
      setRoundIndex(roundIndex + 1);
    }
  };

  return <Dialog open={props.open} onClose={props.onClose} onKeyDown={handleKeyDown}>
    <DialogContent>
      <div style={{textAlign: 'center'}}>
        <Button onClick={() => setRoundIndex(0)} disabled={!canGoToPreviousRound}>
          <KeyboardArrowLeft/>
        </Button>
        <Button onClick={() => setRoundIndex(roundIndex - 1)} disabled={!canGoToPreviousRound}>
          <ArrowLeft/>
        </Button>
        Round {roundIndex + 1} of {pastRounds.length}
        <Button onClick={() => setRoundIndex(roundIndex + 1)} disabled={!canGoToNextRound}>
          <ArrowRight/>
        </Button>
        <Button onClick={() => setRoundIndex(pastRounds.length - 1)} disabled={!canGoToNextRound}>
          <KeyboardArrowRight/>
        </Button>
      </div>
      <div style={{display: 'block', textAlign: 'center'}}>
        Judge: {visibleRound.judge.name}
      </div>
      <CAHBlackCard card={visibleRound.blackCard}/>
      <div className={'panel'}>
          {visibleRound.whitePlayed.map((entry, index) => (
            <div
              style={(visibleRound.winner.user ?
                entry.player.user && entry.player.user.id === visibleRound.winner.user.id :
                entry.player.artificialPlayerName === visibleRound.winner.artificialPlayerName)
                ? {} : {opacity: 0.5}}
              className={'subpanel'}
              key={index}
            >
              <div>
                {
                  entry.player.user ? entry.player.user.name : entry.player.artificialPlayerName
                }
              </div>
              {entry.cards.map((card, index) => (
                <CAHWhiteCard
                  card={card}
                  key={index}
                />
              ))}
            </div>
          ))}
        </div>
    </DialogContent>
  </Dialog>;
};

export default ViewPastRoundsDialog;
