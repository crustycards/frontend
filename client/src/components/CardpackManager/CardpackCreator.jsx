import React from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { TextField, RaisedButton } from 'material-ui';
import api from '../../apiInterface';

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
  const requiredFields = ['cardpackName'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  return errors;
};

const createCardpack = ({cardpackName}) => {
  api.createCardpack(cardpackName);
};

const CardpackCreator = (props) => {
  return (
    <form autoComplete={'off'} onSubmit={props.handleSubmit(createCardpack)}>
      <Field
        name='cardpackName'
        component={renderTextField}
        label='Cardpack Name'
      />
      <br/>
      <RaisedButton type={'submit'} disabled={props.pristine || props.submitting} label='Create Cardpack' />
    </form>
  );
};

const onSubmitSuccess = (result, dispatch) =>
  dispatch(reset('cardpackCreator'));

export default reduxForm({
  form: 'cardpackCreator',
  validate,
  onSubmitSuccess
})(CardpackCreator);