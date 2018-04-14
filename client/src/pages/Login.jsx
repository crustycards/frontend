import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleButton from '../components/GoogleButton/index.jsx';

class Login extends Component {
  constructor(props) {
    super(props);
    if (props.currentUser) {
      props.history.push('/');
    }
  }

  googleOAuthRedirect () {
    window.location.href = '/auth/google';
  }

  render() {
    const navItemStyle = {textDecoration: 'none'};
    return (
      <div className='login center'>
        <h1>Login</h1>
        <GoogleButton className='btn' onClick={this.googleOAuthRedirect} />
      </div>
    );
  }
}

const mapStateToProps = ({global}) => ({
  currentUser: global.currentUser
});

export default connect(mapStateToProps)(Login);