import {Button, CircularProgress, TextField} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import {ApiContextWrapper} from '../api/context';
import Api from '../api/model/api';

interface UsernameChangerProps {
  api: Api;
  onSubmit?(username: string): void;
}

interface UsernameChangerState {
  newUsername: string;
  isLoading: boolean;
}

class UsernameChanger extends Component<UsernameChangerProps, UsernameChangerState> {
  constructor(props: UsernameChangerProps) {
    super(props);

    this.setUsername = this.setUsername.bind(this);
    this.handleNewUsernameChange = this.handleNewUsernameChange.bind(this);

    this.state = {
      newUsername: '',
      isLoading: false
    };
  }

  public render() {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        this.setUsername();
      }}>
        <TextField
          style={{marginTop: '0'}}
          label={'New Username'}
          value={this.state.newUsername}
          onChange={this.handleNewUsernameChange}
        />
        <Button
          style={{margin: '13px 0 0 10px'}}
          color={'primary'}
          variant={'contained'}
          type={'submit'}
          disabled={this.state.newUsername === '' || this.state.isLoading}
        >
          {this.state.isLoading ? <CircularProgress size={24}/> : 'Save'}
        </Button>
      </form>
    );
  }

  private setUsername() {
    this.setState({isLoading: true});
    this.props.api.main.setUsername(this.state.newUsername)
        .then(() => {
          if (this.props.onSubmit) {
            this.props.onSubmit(this.state.newUsername);
          }

          this.setState({isLoading: false, newUsername: ''});
        });
  }

  private handleNewUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({newUsername: e.target.value});
  }
}

export default ApiContextWrapper(UsernameChanger);
