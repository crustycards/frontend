import {CircularProgress, Divider, IconButton, InputBase, makeStyles, Paper, Typography} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import * as React from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useApi} from '../../api/context';
import {StoreState} from '../../store';

const useStyles = makeStyles((theme) => ({
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

const MessageBox = () => {
  const api = useApi();
  const {messages} = useSelector(({game}: StoreState) => ({
    messages: game.messages
  }));
  const [messageText, setMessageText] = useState('');
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const classes = useStyles({});

  return (
    <div className={'panel'}>
      <h2 className={'center'}>Chat</h2>
      <Divider style={{margin: '10px 0'}} />
      <div
        style={{
          maxHeight: '250px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse'
        }}
      >
        {messages.map((message, i) => (
          <Paper
            key={i}
            style={{marginBottom: '8px', marginRight: '5px', padding: '5px'}}
          >
            <Typography variant={'body1'}>
              <b>{message.user.name + ': '}</b>{message.text}
            </Typography>
          </Paper>
        ))}
      </div>
      <form
        style={{marginBottom: 0}}
        autoComplete={'off'}
        onSubmit={(e) => {
          e.preventDefault(); // Stop page from refreshing
          setIsSubmittingMessage(true);
          api.game.sendMessage(messageText).then(() => {
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
            {isSubmittingMessage && <CircularProgress size={40} className={classes.textBoxIconButtonCircularProgress}/>}
          </IconButton>
        </Paper>
      </form>
    </div>
  );
};

export default MessageBox;
