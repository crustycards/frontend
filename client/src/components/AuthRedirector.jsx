import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

class AuthRedirector extends Component {
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

const mapStateToProps = ({global: {user}, router}) => ({
  user,
  path: router.location.pathname
});

export default connect(mapStateToProps)(AuthRedirector);
