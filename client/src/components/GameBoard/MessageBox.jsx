import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import { Paper, RaisedButton, TextField } from 'material-ui';
import { sendMessage } from '../../gameServerInterface';

const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField
    floatingLabelText = {label}
    {...input}
    {...custom}
  />
);

const validate = values => {
  const errors = {};
  const requiredFields = ['messageText'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  return errors;
};

const MessageBox = (props) => {
  return (
    <div className={'panel'}>
      <div style={{maxHeight: '250px', overflow: 'auto', display: 'flex', flexDirection: 'column-reverse'}}>
        {props.messages.map((message, i) => <Paper key={i} style={{marginBottom: '8px', marginRight: '5px', padding: '5px'}}><b>{message.user.name + ': '}</b>{message.text}</Paper>)}
      </div>
      <form autoComplete={'off'} onSubmit={props.handleSubmit(({messageText}) => sendMessage(messageText))}>
        <Field
          name='messageText'
          component={renderTextField}
          label='Message'
        />
        <br/>
        <RaisedButton type={'submit'} disabled={props.pristine || props.submitting} label='Create Cardpack' />
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