import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {User} from '../api/dao';

interface AuthRedirectorProps {
  user: User
  path: string
}

class AuthRedirector extends Component<AuthRedirectorProps> {
  render() {
    if (this.props.user && this.props.path === '/login') {
      return <Redirect to={'/'} />;
    } else if (!this.props.user && this.props.path !== '/login') {
      return <Redirect to={'/login'} />;
    } else {
      return null;
    }
  }
}

const mapStateToProps = ({global: {user}, router}: any) => ({
  user,
  path: router.location.pathname
});

export default connect(mapStateToProps)(AuthRedirector);
