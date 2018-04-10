import React, { Component } from 'react';
import api from '../apiInterface';
import { connect } from 'react-redux';
import { TextField, RaisedButton } from 'material-ui';
import helpers from '../helpers';

class FrienderPanel extends Component {
  constructor (props) {
    super(props);
    this.state = {
      requestEmail: ''
    };
    this.sendRequest = this.sendRequest.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  sendRequest () {
    if (helpers.isEmail(this.state.requestEmail)) {
      // TODO - Fix this to search users rather than add by email
      api.addFriend(this.state.requestEmail);
      this.setState({requestEmail: ''});
    }
  }

  handleInputChange (property, e) {
    let stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.sendRequest();
    }
  }

  render () {
    return (
      <div className="panel">
        <div>Add Friends</div>
        <TextField 
          onKeyPress={this.handleKeyPress} 
          hintText='hello@world.com' 
          floatingLabelText='Email' 
          type='email' 
          value={this.state.requestEmail} 
          onChange={this.handleInputChange.bind(this, 'requestEmail')} 
        />
        <br/>
        <RaisedButton 
          label='Send Friend Request' 
          onClick={this.sendRequest} 
          disabled={!helpers.isEmail(this.state.requestEmail)} 
        />
      </div>
    );
  }
}

const mapStateToProps = ({global}) => ({
  currentUser: global.currentUser
});

export default connect(mapStateToProps)(FrienderPanel);