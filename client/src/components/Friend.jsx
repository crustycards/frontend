import React from 'react';
import axios from 'axios';

class Friend extends React.Component {
  constructor (props) {
    super(props);
    this.remove = this.remove.bind(this);
  }

  remove () {
    axios.delete('/api/friends?user=' + this.props.user.email);
  }

  render () {
    return (
      <div className="subpanel">
        <div>{this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email})</div>
        <button onClick={this.remove}>Unfriend</button>
      </div>
    );
  }
}

export default Friend;