import {
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Theme,
  Typography
} from '@mui/material';
import {makeStyles} from '@material-ui/styles';
import SendIcon from '@mui/icons-material/Send';
import * as React from 'react';
import {useState} from 'react';
import {ChatMessage} from '../../../../../proto-gen-out/crusty_cards_api/game_service_pb';
import {GameService} from '../../api/gameService';
import {useGlobalStyles} from '../../styles/globalStyles';
import {convertTime} from '../../helpers/time';

const useStyles = makeStyles((theme: Theme) => ({
  textBoxRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  textBoxInput: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  textBoxIconButton: {
    padding: 10,
    position: 'relative'
  },
  textBoxIconButtonCircularProgress: {
    position: 'absolute',
    top: 2,
    left: -1,
    zIndex: 1
  }
}));

interface MessageBoxProps {
  gameService: GameService;
  messages: ChatMessage[];
}

const MessageBox = (props: MessageBoxProps) => {
  const [messageText, setMessageText] = useState('');
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const classes = useStyles();
  const globalClasses = useGlobalStyles();

  return (
    <div className={globalClasses.panel}>
      <Typography
        variant={'h5'}
        style={{textAlign: 'center'}}
      >
        Chat
      </Typography>
      <Divider style={{margin: '10px 0'}} />
      <div
        style={{
          maxHeight: '250px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse'
        }}
      >
        {
          props.messages.map((message, i) => (
            <Paper
              key={i}
              style={{marginBottom: '8px', marginRight: '5px', padding: '5px'}}
            >
              <Typography variant={'body1'}>
                {/* TODO - Display message create time
                and any other remaining fields. */}
                <b>
                  {`${(message.getUser()?.getDisplayName() || 'Unknown User')}: `}
                </b>
                {message.getText()}
              </Typography>
              <Typography variant={'body2'}>
                {convertTime(message.getCreateTime())}
              </Typography>
            </Paper>
          ))
        }
      </div>
      <form
        style={{marginBottom: 0}}
        autoComplete={'off'}
        onSubmit={(e) => {
          e.preventDefault(); // Stop page from refreshing
          setIsSubmittingMessage(true);
          props.gameService.createChatMessage(messageText).then(() => {
            setIsSubmittingMessage(false);
            setMessageText('');
          });
        }}
      >
        <Paper className={classes.textBoxRoot}>
          <InputBase
            className={classes.textBoxInput}
            placeholder={'Message'}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <IconButton
            className={classes.textBoxIconButton}
            type={'submit'}
            disabled={!messageText.length || isSubmittingMessage}
          >
            <SendIcon/>
            {
              isSubmittingMessage &&
                <CircularProgress
                  size={40}
                  className={classes.textBoxIconButtonCircularProgress}
                />
            }
          </IconButton>
        </Paper>
      </form>
    </div>
  );
};

export default MessageBox;
