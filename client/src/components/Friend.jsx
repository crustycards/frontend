import React from 'react';
import axios from 'axios';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import { FlatButton } from 'material-ui';

class Friend extends React.Component {
  constructor (props) {
    super(props);
    this.remove = this.remove.bind(this);
  }

  remove () {
    axios.delete('/api/friends', {data: {user: this.props.user.email}});
  }

  render () {
    return (
      <Card className='card'>
        <CardHeader
          title={this.props.user.name}
          subtitle={this.props.user.email}
        />
        <CardActions>
          <FlatButton label='Unfriend' onClick={this.remove} />
        </CardActions>
      </Card>
    );
  }
}

export default Friend;