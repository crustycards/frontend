import React from 'react';
import axios from 'axios';

class FrienderPanel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      requestEmail: ''
    };
    this.sendRequest = this.sendRequest.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  sendRequest () {
    axios.post('/api/friends', {
      type: 'request',
      user: this.state.requestEmail
    });
  }

  onInputChange (e) {
    this.setState({requestEmail: e.target.value});
  }

  render () {
    return (
      <div>
        <div>Friender Panel</div>
        <input type='email' value={this.state.requestEmail} onChange={this.onInputChange} />
        <button onClick={this.sendRequest}>Send Friend Request</button>
      </div>
    );
  }
}

export default FrienderPanel;