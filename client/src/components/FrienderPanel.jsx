import React, { Component } from 'react';
import { searchUsers, autocompleteUserSearch } from '../apiInterface';
import { connect } from 'react-redux';
import { AutoComplete, RaisedButton } from 'material-ui';
import { AccessAlarm } from 'material-ui-icons';
import UserCard from './shells/UserCard.jsx';

class FrienderPanel extends Component {
  constructor (props) {
    super(props);
    this.state = {
      searchQuery: '',
      autocompleteOptions: [],
      hasSearched: false,
      searchedUsers: []
    };
    this.searchUsers = this.searchUsers.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  searchUsers() {
    searchUsers(this.state.searchQuery)
      .then(searchedUsers => this.setState({searchedUsers, hasSearched: true}));
  }

  handleInputChange (searchQuery) {
    this.setState({searchQuery});
    autocompleteUserSearch(searchQuery).then(autocompleteOptions => this.setState({autocompleteOptions}));
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.searchUsers();
    }
  }

  render () {
    return (
      <div className='panel'>
        <div>Search Users</div>
        <AutoComplete
          onKeyPress={this.handleKeyPress}
          onNewRequest={this.searchUsers}
          menuCloseDelay={0}
          hintText='User Name'
          floatingLabelText='Name'
          type='email'
          searchText={this.state.searchQuery}
          dataSource={this.state.autocompleteOptions}
          onUpdateInput={this.handleInputChange}
          filter={AutoComplete.caseInsensitiveFilter}
        />
        <RaisedButton
          style={{margin: '3px'}}
          label='Search Users'
          onClick={this.searchUsers}
          primary={true}
        />
        {
          this.state.hasSearched &&
          <div style={{marginTop: '14px'}}>
            {
              this.state.searchedUsers.length ?
                this.state.searchedUsers.map((user, index) =>
                  <UserCard user={user} showFriendButton key={index} />
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

const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(FrienderPanel);