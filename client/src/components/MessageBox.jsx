import React from 'react';
import axios from 'axios';

class MessageBox extends React.Component {
  constructor (props) {
    super(props);
    this.socket = props.socket;
    this.state = {
      user: props.user || null, // The other user you are messaging
      messageInput: '',
      messages: []
    };
    this.getMessages(); // Retrieves messages over http only on component load, otherwise will use sockets to update
    this.socket.on('message', (messageString) => {
      let message = JSON.stringify(messageString);
      // Only render new messages that are between you and the other person
      if (message.sender.email === this.user.email || message.receiver.email === this.user.email) {
        this.state.messages.push(message);
        this.forceUpdate();
      }
    });
  }

  // Retrieves messages over http
  getMessages () {
    // TODO - Finish implementing
    axios.get('/api/messages?user=' + this.state.user.email)
    .then((response) => {
      let messages = response.data;
      if (!messages.error) {
        return this.setState({messages});
      } else {
        console.error(messages.error);
      }
    });
  }

  sendMessage () {
    axios.post('/api/messages', {
      message: this.state.messageInput
    });
    this.setState({messageInput: ''});
  }

  handleInputChange (e) {
    this.setState({messageInput: e.target.value});
  }

  render () {
    return (
      <div>
        <div>Message Box</div>
        <input type='text' value={this.state.messageInput} onChange={this.handleInputChange.bind(this)} />
        <button onClick={this.sendMessage}>Send</button>
        <div>
          {this.state.messages.map((message) => {
            return (
              <div>{JSON.stringify(message)}</div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default MessageBox;