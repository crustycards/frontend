import * as React from 'react';
import {Component} from 'react';
import AutoComplete from './AutoComplete';
import UserCard from './shells/UserCard';
import {ApiContextWrapper} from '../api/context';
import Api from '../api/model/api';
import {User} from '../api/dao';

interface FrienderPanelProps {
  api: Api
}

interface FrienderPanelState {
  hasSearched: boolean
  searchedUsers: User[]
}

class FrienderPanel extends Component<FrienderPanelProps, FrienderPanelState> {
  constructor(props: FrienderPanelProps) {
    super(props);

    this.state = {
      hasSearched: false,
      searchedUsers: []
    };

    this.searchUsers = this.searchUsers.bind(this);
  }

  searchUsers(query: string) {
    this.props.api.main.searchUsers(query)
        .then((searchedUsers) =>
          this.setState({
            searchedUsers,
            hasSearched: true
          })
        );
  }

  render() {
    return (
      <div className='panel'>
        <div>Search Users</div>
        <AutoComplete
          label={'Search Users'}
          getSuggestions={this.props.api.main.autocompleteUserSearch}
          onSubmit={this.searchUsers}
        />
        {
          this.state.hasSearched &&
          <div style={{marginTop: '14px'}}>
            {
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
