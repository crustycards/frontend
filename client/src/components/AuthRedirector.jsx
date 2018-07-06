import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

class AuthRedirector extends Component {
  render() {
    if (this.props.currentUser && this.props.path === '/login') {
      return <Redirect to={'/'} />;
    } else if (!this.props.currentUser && this.props.path !== '/login') {
      return <Redirect to={'/login'} />;
    } else {
      return null;
    }
  }
}

const mapStateToProps = ({user, router}) => ({
  currentUser: user.currentUser,
  path: router.location.pathname
});

export default connect(mapStateToProps)(AuthRedirector);
