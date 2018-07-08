import React, {Component} from 'react';
import queryString from 'query-string';
import {getUser, getCardpacksByUser} from '../apiInterface';
import {CircularProgress} from '@material-ui/core';

class User extends Component {
  constructor(props) {
    super(props);

    const userId = queryString.parse(props.location.search).id;

    this.state = {
      isLoading: true,
      successfullyLoaded: false,
      user: undefined,
      cardpacks: undefined
    };

    if (typeof userId === 'string') {
      Promise.all([getUser(userId), getCardpacksByUser(userId)])
        .then(([user, cardpacks]) => {
          this.setState({user, cardpacks, isLoading: false, successfullyLoaded: true});
        })
        .catch(() => {
          this.setState({isLoading: false, successfullyLoaded: false});
        });
    } else {
      this.setState({isLoading: false, successfullyLoaded: false});
    }
  }

  render() {
    if (this.state.isLoading) {
      return (<CircularProgress/>);
    } else if (!this.state.successfullyLoaded) {
      return (<div>User does not exist</div>);
    }

    return (
      <div className='content-wrap'>
        {this.state.user.name}
        <br/>
        {this.state.cardpacks.map((cardpack) => (cardpack.name)).join(', ')}
      </div>
    );
  }
}

export default User;
