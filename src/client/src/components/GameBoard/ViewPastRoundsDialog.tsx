import {Button, Dialog, DialogContent} from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import * as React from 'react';
import {CustomWhiteCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {getPlayerDisplayName, playersAreEqual} from '../../helpers/proto';
import CAHCustomWhiteCard from '../shells/CAHCustomWhiteCard';
import {PastRound} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {Panel, Subpanel} from '../../styles/globalStyles';
import CAHBlackCardInRound from '../shells/CAHBlackCardInRound';

interface ViewPastRoundsDialogProps {
  pastRounds: PastRound[];
  open: boolean;
  onClose?: () => void;
}

const ViewPastRoundsDialog = (props: ViewPastRoundsDialogProps) => {
  const [roundIndex, setRoundIndex] = React.useState(0);

  // Since pastRounds can be reset to empty whenever the game is restarted, we
  // need to check at every render to make sure that roundIndex is in bounds.
  // TODO - Fix this by possibly moving the roundIndex to redux state?
  if (roundIndex > 0 && roundIndex >= props.pastRounds.length) {
    setRoundIndex(props.pastRounds.length - 1);
  }

  if (!props.pastRounds.length) {
    return <Dialog open={props.open} onClose={props.onClose}>
      {/* TODO - Wrap this text in Typography. */}
      No rounds are available!
    </Dialog>;
  }

  const canGoToNextRound = roundIndex < props.pastRounds.length - 1;
  const canGoToPreviousRound = roundIndex > 0;
  const visibleRound = props.pastRounds[roundIndex];
  const visibleRoundBlackCard = visibleRound.getBlackCard();

  // TODO - Event.keyCode is deprecated. Replace it with Event.key.
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
            <KeyboardArrowLeftIcon/>
          </Button>
          <Button
            onClick={() => setRoundIndex(roundIndex - 1)}
            disabled={!canGoToPreviousRound}
          >
            <ArrowLeftIcon/>
          </Button>
          Round {roundIndex + 1} of {props.pastRounds.length}
          <Button
            onClick={() => setRoundIndex(roundIndex + 1)}
            disabled={!canGoToNextRound}
          >
            <ArrowRightIcon/>
          </Button>
          <Button
            onClick={() => setRoundIndex(props.pastRounds.length - 1)}
            disabled={!canGoToNextRound}
          >
            <KeyboardArrowRightIcon/>
          </Button>
        </div>
        <div style={{display: 'block', textAlign: 'center'}}>
          {`Judge: ${visibleRound.getJudge()?.getDisplayName() || 'Unknown'}`}
        </div>
        {
          visibleRoundBlackCard &&
            <CAHBlackCardInRound card={visibleRoundBlackCard}/>
        }
        <Panel>
          {visibleRound.getWhitePlayedList().map((entry, index) => (
            <Subpanel
              style={
                playersAreEqual(
                  entry.getPlayer(),
                  visibleRound.getWinner()
                ) ? {} : {opacity: 0.5}
              }
              key={index}
            >
              <div>
                {getPlayerDisplayName(entry.getPlayer())}
              </div>
              {entry.getCardTextsList().map((cardText) => {
                const card = new CustomWhiteCard();
                card.setText(cardText);
                return card;
              }).map((card, index) => (
                <CAHCustomWhiteCard
                  card={card}
                  key={index}
                />
              ))}
            </Subpanel>
          ))}
        </Panel>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPastRoundsDialog;
