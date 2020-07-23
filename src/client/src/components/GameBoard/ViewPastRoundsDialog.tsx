import {Button, Dialog, DialogContent} from '@material-ui/core';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import * as React from 'react';
import {useSelector} from 'react-redux';
import {WhiteCard} from '../../../../../proto-gen-out/api/model_pb';
import {getPlayerDisplayName, playersAreEqual} from '../../helpers/proto';
import {StoreState} from '../../store';
import CAHBlackCard from '../shells/CAHBlackCard';
import CAHWhiteCard from '../shells/CAHWhiteCard';
import {PastRound} from '../../../../../proto-gen-out/game/game_service_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

interface ViewPastRoundsDialogProps {
  pastRounds: PastRound[];
  open: boolean;
  onClose?: () => void;
}

const ViewPastRoundsDialog = (props: ViewPastRoundsDialogProps) => {
  const [roundIndex, setRoundIndex] = React.useState(0);

  const globalClasses = useGlobalStyles();

  // Since pastRounds can be reset to empty whenever the game is restarted, we
  // need to check at every render to make sure that roundIndex is in bounds.
  // TODO - Fix this by possibly moving the roundIndex to redux state?
  if (roundIndex > 0 && roundIndex >= props.pastRounds.length) {
    setRoundIndex(props.pastRounds.length - 1);
  }

  if (!props.pastRounds.length) {
    return <Dialog open={props.open} onClose={props.onClose}>
      No round are available!
    </Dialog>;
  }

  const canGoToNextRound = roundIndex < props.pastRounds.length - 1;
  const canGoToPreviousRound = roundIndex > 0;
  const visibleRound = props.pastRounds[roundIndex];
  const visibleRoundBlackCard = visibleRound.getBlackCard();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Key codes for up/left arrow keys.
    if ((e.keyCode === 37 || e.keyCode === 38) && canGoToPreviousRound) {
      setRoundIndex(roundIndex - 1);
    }

    // Key codes for down/right arrow keys.
    if ((e.keyCode === 39 || e.keyCode === 40) && canGoToNextRound) {
      setRoundIndex(roundIndex + 1);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      onKeyDown={handleKeyDown}
    >
      <DialogContent>
        <div style={{textAlign: 'center'}}>
          <Button
            onClick={() => setRoundIndex(0)}
            disabled={!canGoToPreviousRound}
          >
            <KeyboardArrowLeft/>
          </Button>
          <Button
            onClick={() => setRoundIndex(roundIndex - 1)}
            disabled={!canGoToPreviousRound}
          >
            <ArrowLeft/>
          </Button>
          Round {roundIndex + 1} of {props.pastRounds.length}
          <Button
            onClick={() => setRoundIndex(roundIndex + 1)}
            disabled={!canGoToNextRound}
          >
            <ArrowRight/>
          </Button>
          <Button
            onClick={() => setRoundIndex(props.pastRounds.length - 1)}
            disabled={!canGoToNextRound}
          >
            <KeyboardArrowRight/>
          </Button>
        </div>
        <div style={{display: 'block', textAlign: 'center'}}>
          {`Judge: ${visibleRound.getJudge()?.getName() || 'Unknown'}`}
        </div>
        {visibleRoundBlackCard && <CAHBlackCard card={visibleRoundBlackCard}/>}
        <div className={globalClasses.panel}>
            {visibleRound.getWhitePlayedList().map((entry, index) => (
              <div
                style={
                  playersAreEqual(
                    entry.getPlayer(),
                    visibleRound.getWinner()
                  ) ? {} : {opacity: 0.5}
                }
                className={globalClasses.subpanel}
                key={index}
              >
                <div>
                  {getPlayerDisplayName(entry.getPlayer())}
                </div>
                {entry.getCardTextsList().map((cardText) => {
                  const card = new WhiteCard();
                  card.setText(cardText);
                  return card;
                }).map((card, index) => (
                  <CAHWhiteCard
                    card={card}
                    key={index}
                  />
                ))}
              </div>
            ))}
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPastRoundsDialog;
