import React from 'react';
import {Field, reduxForm, reset} from 'redux-form';
import {TextField, Button} from '@material-ui/core';
import api from '../../apiInterface';

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
    margin={'normal'}
  />
);

const validate = (values) => {
  const errors = {};
  const requiredFields = ['cardpackName'];
  requiredFields.forEach((field) => {
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
      <Button type={'submit'} disabled={props.pristine || props.submitting}>
        Create Cardpack
      </Button>
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
