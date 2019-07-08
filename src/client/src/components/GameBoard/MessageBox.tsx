import {Button, Divider, Paper, TextField, Typography} from '@material-ui/core';
import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {Field, FormErrors, InjectedFormProps, reduxForm, reset, SubmitHandler} from 'redux-form';
import {ApiContextWrapper} from '../../api/context';
import Api from '../../api/model/api';

const renderTextField = ({
  input,
  label,
  meta,
  ...custom
}: any) => (
  <TextField
    label={label}
    {...input}
    {...custom}
  />
);

interface MessageFormData {
  messageText: string;
}

const validate = (values: MessageFormData) => {
  const {messageText} = values;

  const errors: FormErrors<MessageFormData> = {};

  if (!messageText) {
    errors.messageText = 'Required';
  }

  return errors;
};

interface MessageBoxProps extends InjectedFormProps {
  api: Api;
  handleSubmit: SubmitHandler<MessageFormData>;
  messages: any[];
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
            <Typography variant={'body1'}>
              <b>{message.user.name + ': '}</b>{message.text}
            </Typography>
          </Paper>
        ))}
      </div>
      <form
        autoComplete={'off'}
        onSubmit={props.handleSubmit(({messageText}) => {
          props.api.game.sendMessage(messageText);
        })}
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

const mapStateToProps = ({game}: any) => ({
  messages: game.messages
});

const ReduxConnectedMessageBox = connect(mapStateToProps)(ContextLinkedMessageBox);

const onSubmitSuccess = (_: any, dispatch: Dispatch) =>
  dispatch(reset('gameMessage'));

export default reduxForm({
  form: 'gameMessage',
  validate,
  onSubmitSuccess
})(ReduxConnectedMessageBox);
