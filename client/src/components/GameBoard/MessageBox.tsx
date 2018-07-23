import * as React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, reset} from 'redux-form';
import {Paper, Button, TextField, Typography, Divider} from '@material-ui/core';
import {ApiContextWrapper} from '../../api/context';
import Api from '../../api/model/api';
import {Dispatch} from 'redux';

const renderTextField = ({
  input,
  label,
  meta,
  ...custom
}) => (
  <TextField
    label={label}
    {...input}
    {...custom}
  />
);

const validate = (values) => {
  const errors = {};
  const requiredFields = ['messageText'];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  return errors;
};

interface MessageBoxProps {
  messages: Array<any>
  handleSubmit: (fun: (data: {messageText: string}) => void) => void
  api: Api
}

const MessageBox = (props: MessageBoxProps) => {
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
        {props.messages.map((message, i) => (
          <Paper
            key={i}
            style={{marginBottom: '8px', marginRight: '5px', padding: '5px'}}
          >
            <Typography variant={'body2'}>
              <b>{message.user.name + ': '}</b>{message.text}
            </Typography>
          </Paper>
        ))}
      </div>
      <form
        autoComplete={'off'}
        onSubmit={() => {
          props.handleSubmit(({messageText}) => {
            props.api.game.sendMessage(messageText);
          })
        }}
      >
        <Field
          name='messageText'
          component={renderTextField}
          label='Message'
        />
        <br/>
        <Button
          style={{marginTop: '10px'}}
          variant={'outlined'}
          type={'submit'}
          disabled={props.pristine || props.submitting}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

const ContextLinkedMessageBox = ApiContextWrapper(MessageBox);

const mapStateToProps = ({game}) => ({
  messages: game.messages
});

const ReduxConnectedMessageBox = connect(mapStateToProps)(ContextLinkedMessageBox);

const onSubmitSuccess = (_: any, dispatch: Dispatch<any>) => dispatch(reset('gameMessage'));

export default reduxForm({
  form: 'gameMessage',
  validate,
  onSubmitSuccess
})(ReduxConnectedMessageBox);
