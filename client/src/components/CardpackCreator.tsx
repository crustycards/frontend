import * as React from 'react';
import {Component} from 'react';
import {Field, reduxForm, reset, FormErrors, InjectedFormProps, SubmitHandler} from 'redux-form';
import {TextField, Button, CircularProgress} from '@material-ui/core';
import {ApiContextWrapper} from '../api/context';
import Api from '../api/model/api';
import { Cardpack } from '../api/dao';

const renderTextField = ({
  input,
  label,
  meta: {
    touched,
    error
  },
  ...custom
}: any) => (
  <TextField
    label={label}
    {...input}
    {...custom}
    margin={'normal'}
  />
);

interface CardpackFormData {
  cardpackName: string
}

const validate = (values: CardpackFormData): FormErrors<CardpackFormData> => {
  const {cardpackName} = values;

  const errors: FormErrors<CardpackFormData> = {};

  if (!cardpackName) {
    errors.cardpackName = 'Required';
  }

  return errors;
};

interface CardpackCreatorProps extends InjectedFormProps {
  api: Api
  handleSubmit: SubmitHandler<CardpackFormData>
  onSubmit?(cardpack: Cardpack): void
}

interface CardpackCreatorState {
  isLoading: boolean
}

class CardpackCreator extends Component<CardpackCreatorProps, CardpackCreatorState> {
  constructor(props: CardpackCreatorProps) {
    super(props);

    this.createCardpack = this.createCardpack.bind(this);

    this.state = {
      isLoading: false
    };
  }

  createCardpack({cardpackName}: CardpackFormData) {
    this.setState({isLoading: true});
    const cardpackCreation = this.props.api.main.createCardpack(cardpackName);
    cardpackCreation.then((cardpack) => {
      this.setState({isLoading: false});
      
      this.props.onSubmit && this.props.onSubmit(cardpack)
    });
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

const ContextLinkedCardpackCreator = ApiContextWrapper(CardpackCreator);

const onSubmitSuccess = (_: any, dispatch: any) =>
  dispatch(reset('cardpackCreator'));

export default reduxForm({
  form: 'cardpackCreator',
  validate,
  onSubmitSuccess
})(ContextLinkedCardpackCreator);
