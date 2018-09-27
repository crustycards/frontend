import React, {Component} from 'react';
import queryString from 'query-string';
import {CircularProgress} from '@material-ui/core';
import CardpackList from '../components/CardpackList/index.tsx';
import CardpackCreator from '../components/CardpackCreator';
import {connect} from 'react-redux';
import {ApiContextWrapper} from '../api/context';
import ProfileImageUploader from '../components/ProfileImageUploader';
import UrlImage from '../components/UrlImage';

class User extends Component {
  constructor(props) {
    super(props);

    const userId = queryString.parse(props.location.search).id;

    this.isCurrentUser = this.props.user && this.props.user.id === userId;

    this.state = {
      isLoading: true,
      successfullyLoaded: false,
      user: undefined,
      cardpacks: undefined
    };

    if (typeof userId === 'string') {
      Promise.all([
        this.props.api.main.getUser(userId),
        this.props.api.main.getCardpacksByUser(userId)
      ])
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
      return (
        <div style={{
          textAlign: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: 0,
          transform: 'translate(-50%, -50%)'
        }}>
          <h1>Loading User Page</h1>
          <CircularProgress size={100}/>
        </div>
      );
    } else if (!this.state.successfullyLoaded) {
      return (<h1>User Not Found</h1>);
    }

    return (
      <div>
        <div className={'col-narrow'}>
          {this.state.user.name}
          {
            this.isCurrentUser &&
            <ProfileImageUploader/>
          }
          <UrlImage
            url={this.props.api.main.getProfileImageUrl(this.state.user.id)}
            loadingView={<CircularProgress/>}
            imageStyle={{
              height: '150px',
              width: '150px',
              borderRadius: '5px'
            }}
          />
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

const ContextLinkedUser = ApiContextWrapper(User);

const mapStateToProps = ({global: {user}}) => ({user});

export default connect(mapStateToProps)(ContextLinkedUser);
