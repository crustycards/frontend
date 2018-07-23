import React, {Component} from 'react';
import queryString from 'query-string';
import mainApi from '../api/apiInterface';
import {CircularProgress} from '@material-ui/core';
import CardpackList from '../components/CardpackList/index.jsx';
import CardpackCreator from '../components/CardpackCreator.jsx';
import {connect} from 'react-redux';

const {getUser, getCardpacksByUser} = mainApi;

class User extends Component {
  constructor(props) {
    super(props);

    const userId = queryString.parse(props.location.search).id;

    this.isCurrentUser = this.props.user.id === userId;

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
          {
            this.isCurrentUser &&
            <CardpackCreator onSubmit={(cardpack) => {
              this.setState({cardpacks: this.state.cardpacks.concat(cardpack)});
            }} />
          }
          <CardpackList cardpacks={this.state.cardpacks} canDelete={this.isCurrentUser} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({global: {user}}) => ({user});

export default connect(mapStateToProps)(User);
