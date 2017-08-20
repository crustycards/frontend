import React from 'react';
import axios from 'axios';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import time from '../../helpers/time.js';

class Cardpack extends React.Component {
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
          subtitle={'Created ' + time.parse(this.props.cardpack.createdAt, true)}
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