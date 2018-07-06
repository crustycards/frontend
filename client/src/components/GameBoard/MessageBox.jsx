import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, reset} from 'redux-form';
import {Paper, Button, TextField, Typography, Divider} from '@material-ui/core';
import {sendMessage} from '../../gameServerInterface';

const renderTextField = ({
  input,
  label,
  meta: {touched, error},
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

const MessageBox = (props) => {
  return (
    <div className={'panel'}>
      <h2 className={'center'}>Chat</h2>
      <Divider style={{margin: '10px 0'}} />
      <div style={{maxHeight: '250px', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse'}}>
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
      <form autoComplete={'off'} onSubmit={props.handleSubmit(({messageText}) => sendMessage(messageText))}>
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

const mapStateToProps = ({game}) => ({
  messages: game.messages
});

const onSubmitSuccess = (result, dispatch) =>
  dispatch(reset('gameMessage'));

export default reduxForm({
  form: 'gameMessage',
  validate,
  onSubmitSuccess
})(connect(mapStateToProps)(MessageBox));
