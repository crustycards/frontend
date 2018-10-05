import {CircularProgress} from '@material-ui/core';
import * as queryString from 'query-string';
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {ApiContextWrapper} from '../api/context';
import {Cardpack, User as UserModel} from '../api/dao';
import Api from '../api/model/api';
import CardpackCreator from '../components/CardpackCreator';
import CardpackList from '../components/CardpackList/index';
import ProfileImageUploader from '../components/ProfileImageUploader';
import UrlImage from '../components/UrlImage';

interface UserProps {
  user: UserModel;
  location: {
    search: string
  };
  api: Api;
}

interface UserState {
  isCurrentUser: boolean;
  isLoading: boolean;
  successfullyLoaded: boolean;
  user: UserModel;
  cardpacks: Cardpack[];
}

class User extends Component<UserProps, UserState> {
  constructor(props: UserProps) {
    super(props);

    const userId = queryString.parse(props.location.search).id;

    this.state = {
      isCurrentUser: this.props.user && this.props.user.id === userId,
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

  public render() {
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
            this.state.isCurrentUser &&
            <ProfileImageUploader/>
          }
          <UrlImage
            url={this.props.api.main.getProfileImageUrl(this.state.user.id)}
            loadingView={<CircularProgress/>}
            errorView={<div>No profile image</div>}
            imageStyle={{
              height: '150px',
              width: '150px',
              borderRadius: '5px'
            }}
          />
        </div>
        <div className={'col-wide'}>
          {
            this.state.isCurrentUser &&
            <CardpackCreator onSubmit={(cardpack) => {
              this.setState({cardpacks: this.state.cardpacks.concat(cardpack)});
            }} />
          }
          <CardpackList
            cardpacks={this.state.cardpacks}
            canDelete={this.state.isCurrentUser}
            onDelete={(id) => {
              this.setState({
                cardpacks: this.state.cardpacks.filter((cardpack) => cardpack.id !== id)
              });
            }}
          />
        </div>
      </div>
    );
  }
}

const ContextLinkedUser = ApiContextWrapper(User);

const mapStateToProps = ({global: {user}}: any) => ({user});

export default connect(mapStateToProps)(ContextLinkedUser);
