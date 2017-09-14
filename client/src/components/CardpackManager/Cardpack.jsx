import React, { Component } from 'react';
import axios from 'axios';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import time from 'time-converter';

class Cardpack extends Component {
  constructor (props) {
    super(props);
    this.delete = this.delete.bind(this);
  }

  delete () {
    axios.delete('/api/cardpacks', {
      data: {id: this.props.cardpack.id}
    });
  }

  render () {
    return (
      <Card className='card'>
        <CardHeader
          title={this.props.cardpack.name}
          subtitle={'Created ' + time.stringify(this.props.cardpack.createdAt, {relativeTime: true})}
        />
        <CardActions>
          <FlatButton label='Edit' onClick={() => {window.location.href = '/cardpack?id=' + this.props.cardpack.id}} />
          <FlatButton label='Delete' onClick={this.delete} />
        </CardActions>
      </Card>
    )
  }
}

export default Cardpack;