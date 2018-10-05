import {CircularProgress} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import {ApiContextWrapper} from '../api/context';
import {User} from '../api/dao';
import Api from '../api/model/api';
import AutoComplete from './AutoComplete';
import UserCard from './shells/UserCard';

interface FrienderPanelProps {
  api: Api;
}

interface FrienderPanelState {
  hasSearched: boolean;
  isSearching: boolean;
  searchedUsers: User[];
}

class FrienderPanel extends Component<FrienderPanelProps, FrienderPanelState> {
  constructor(props: FrienderPanelProps) {
    super(props);

    this.state = {
      hasSearched: false,
      isSearching: false,
      searchedUsers: []
    };

    this.searchUsers = this.searchUsers.bind(this);
  }

  private searchUsers(query: string) {
    if (!this.state.isSearching) {
      this.setState({isSearching: true});
      this.props.api.main.searchUsers(query)
          .then((searchedUsers) =>
            this.setState({
              hasSearched: true,
              isSearching: false,
              searchedUsers
            })
          );
    }
  }

  public render() {
    return (
      <div className='panel'>
        <div>Search Users</div>
        <AutoComplete
          label={'Search Users'}
          getSuggestions={this.props.api.main.autocompleteUserSearch}
          onSubmit={this.searchUsers}
        />
        {
          (this.state.isSearching || this.state.hasSearched) &&
            <div style={{marginTop: '14px'}}>
              {
                this.state.isSearching ?
                  <CircularProgress style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}}/>
                  :
                  this.state.searchedUsers.length ?
                    this.state.searchedUsers.map((user, index) =>
                      <UserCard
                        user={user}
                        showFriendButton
                        key={index}
                      />
                    )
                    :
                    <div>No users were found</div>
              }
            </div>
        }
      </div>
    );
  }
}

export default ApiContextWrapper(FrienderPanel);
