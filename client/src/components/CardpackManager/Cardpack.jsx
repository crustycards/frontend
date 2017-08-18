import React from 'react';
import axios from 'axios';

class Cardpack extends React.Component {
  constructor (props) {
    super(props);
    this.delete = this.delete.bind(this);
  }

  delete () {
    axios.delete('/api/cardpacks', {
      data: {id: this.props.cardpack.id}
    })
    .then(() => {
      this.props.delete();
    });
  }

  render () {
    return (
      <div>
        <div>{this.props.cardpack.name}</div>
        <button onClick={this.delete}>Delete</button>
      </div>
    )
  }
}

export default Cardpack;