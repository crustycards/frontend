import React, {Component} from 'react';
import {searchUsers, autocompleteUserSearch} from '../api/apiInterface';
import AutoComplete from './AutoComplete.jsx';
import UserCard from './shells/UserCard.jsx';

class FrienderPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasSearched: false,
      searchedUsers: []
    };

    this.searchUsers = this.searchUsers.bind(this);
  }

  searchUsers(query) {
    searchUsers(query)
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
          getSuggestions={autocompleteUserSearch}
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

export default FrienderPanel;
