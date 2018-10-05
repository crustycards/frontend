import {Button, CircularProgress, TextField} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import {ApiContextWrapper} from '../api/context';
import {Cardpack} from '../api/dao';
import Api from '../api/model/api';

interface CardpackCreatorProps {
  api: Api;
  onSubmit?(cardpack: Cardpack): void;
}

interface CardpackCreatorState {
  cardpackName: string;
  isLoading: boolean;
}

class CardpackCreator extends Component<CardpackCreatorProps, CardpackCreatorState> {
  constructor(props: CardpackCreatorProps) {
    super(props);

    this.createCardpack = this.createCardpack.bind(this);
    this.handleCardpackNameChange = this.handleCardpackNameChange.bind(this);

    this.state = {
      cardpackName: '',
      isLoading: false
    };
  }

  private createCardpack() {
    this.setState({isLoading: true});
    this.props.api.main.createCardpack(this.state.cardpackName)
        .then((cardpack) => {
          this.setState({isLoading: false, cardpackName: ''});

          if (this.props.onSubmit) {
            this.props.onSubmit(cardpack);
          }
        });
  }

  private handleCardpackNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({cardpackName: e.target.value});
  }

  public render() {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        this.createCardpack();
      }}>
        <TextField
          label={'Cardpack Name'}
          value={this.state.cardpackName}
          onChange={this.handleCardpackNameChange}
          margin={'normal'}
        />
        <br/>
        <Button
          type={'submit'}
          disabled={this.state.cardpackName === '' || this.state.isLoading}
        >
          Create Cardpack
        </Button>
        {this.state.isLoading && <CircularProgress size={25} style={{verticalAlign: 'sub'}} />}
      </form>
    );
  }
}

export default ApiContextWrapper(CardpackCreator);
