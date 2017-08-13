import React from 'react';
import Friend from './Friend.jsx';

class FriendsList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="panel">
        <div>Friends List</div>
        {this.props.friends.map((friend) => {
          return <Friend user={friend} />
        })}
      </div>
    );
  }
}

export default FriendsList;