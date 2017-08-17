import React from 'react';
import FriendRequest from './FriendRequest.jsx';
import store from '../store';
import {connect} from 'react-redux';

class FriendRequestsSent extends React.Component {
  constructor (props) {
    super(props);
    this.state = store.getState();
    console.log(this.state.requestsSent);
  }

  render () {
    return (
      <div className="panel">
        <div>Friend Requests Sent</div>
        {(this.state.requestsSent).map((user, index) => {
          return <FriendRequest user={user} type="sent" key={index} />
        })}
      </div>
    );
  }
}

export default connect((state) => state)(FriendRequestsSent);