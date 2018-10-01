import {Button, CircularProgress, TextField} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import { Dispatch } from 'redux';
import {Field, FormErrors, InjectedFormProps, reduxForm, reset, SubmitHandler} from 'redux-form';
import {ApiContextWrapper} from '../api/context';
import { Cardpack } from '../api/dao';
import Api from '../api/model/api';

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
    margin={'normal'}
  />
);

interface CardpackFormData {
  cardpackName: string;
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
  api: Api;
  handleSubmit: SubmitHandler<CardpackFormData>;
  onSubmit?(cardpack: Cardpack): void;
}

interface CardpackCreatorState {
  isLoading: boolean;
}

class CardpackCreator extends Component<CardpackCreatorProps, CardpackCreatorState> {
  constructor(props: CardpackCreatorProps) {
    super(props);

    this.createCardpack = this.createCardpack.bind(this);

    this.state = {
      isLoading: false
    };
  }

  public createCardpack({cardpackName}: CardpackFormData) {
    this.setState({isLoading: true});
    const cardpackCreation = this.props.api.main.createCardpack(cardpackName);
    cardpackCreation.then((cardpack) => {
      this.setState({isLoading: false});

      if (this.props.onSubmit) {
        this.props.onSubmit(cardpack);
      }
    });
  }

  public render() {
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

const onSubmitSuccess = (_: any, dispatch: Dispatch) =>
  dispatch(reset('cardpackCreator'));

export default reduxForm({
  form: 'cardpackCreator',
  validate,
  onSubmitSuccess
})(ContextLinkedCardpackCreator);
