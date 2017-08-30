import React, {Component} from 'react';
import Friend from './Friend.jsx';
import { connect } from 'react-redux';

class FriendsList extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="panel">
        <div>Friends</div>
        {(this.props.friends || []).map((friend, index) => {
          return <Friend user={friend} key={index} />;
        })}
      </div>
    );
  }
}

export default FriendsList;