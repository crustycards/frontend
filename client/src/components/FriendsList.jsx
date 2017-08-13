import React from 'react';

class FriendsList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <div>Friends List</div>
        {this.props.friends.map((friend) => {
          return <div>{friend.firstname} {friend.lastname}</div>
        })}
      </div>
    );
  }
}

export default FriendsList;