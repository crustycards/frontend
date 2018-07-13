import React, {Component} from 'react';
import {Field, reduxForm, reset} from 'redux-form';
import {TextField, Button, CircularProgress} from '@material-ui/core';
import api from '../apiInterface';

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

class CardpackCreator extends Component {
  constructor(props) {
    super(props);

    this.createCardpack = this.createCardpack.bind(this);

    this.state = {
      isLoading: false
    };
  }

  createCardpack({cardpackName}) {
    this.setState({isLoading: true});
    const cardpackCreation = api.createCardpack(cardpackName);
    cardpackCreation.then(() => {
      this.setState({isLoading: false});
    });
    this.props.onSubmit && cardpackCreation.then((cardpack) => this.props.onSubmit(cardpack));
  }

  render() {
    return (
      <form autoComplete={'off'} onSubmit={this.props.handleSubmit(this.createCardpack)}>
        <Field
          name='cardpackName'
          component={renderTextField}
          label='Cardpack Name'
        />
        <br/>
        <Button
          type={'submit'}
          disabled={this.props.pristine || this.props.submitting || this.state.isLoading}
        >
          Create Cardpack
        </Button>
        {this.state.isLoading && <CircularProgress size={25} style={{verticalAlign: 'sub'}} />}
      </form>
    );
  }
}

const onSubmitSuccess = (result, dispatch) =>
  dispatch(reset('cardpackCreator'));

export default reduxForm({
  form: 'cardpackCreator',
  validate,
  onSubmitSuccess
})(CardpackCreator);
