import React from 'react';
import axios from 'axios';
import { TextField, RaisedButton } from 'material-ui';
import helpers from '../helpers';

class FrienderPanel extends React.Component {
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
      axios.post('/api/friends', {
        type: 'request',
        user: this.state.requestEmail
      })
        .then(() => {
          this.setState({requestEmail: ''});
        });
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

export default FrienderPanel;