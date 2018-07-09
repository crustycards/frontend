import React, {Component} from 'react';
import queryString from 'query-string';
import {getUser, getCardpacksByUser} from '../apiInterface';
import {CircularProgress} from '@material-ui/core';
import CardpackList from '../components/CardpackList/index.jsx';
import CardpackCreator from '../components/CardpackCreator.jsx';

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
      <div>
        <div className={'col-narrow'}>
          {this.state.user.name}
        </div>
        <div className={'col-wide'}>
          <CardpackCreator/>
          <CardpackList cardpacks={this.state.cardpacks}/>
        </div>
      </div>
    );
  }
}

export default User;
