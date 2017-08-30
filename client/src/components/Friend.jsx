import React from 'react';
import axios from 'axios';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
          title={this.props.user.firstname + ' ' + this.props.user.lastname}
          subtitle={this.props.user.email}
        />
        <CardActions>
          <FlatButton label='Unfriend' onClick={this.remove} />
        </CardActions>
      </Card>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({

});

export default connect(
  null,
  mapDispatchToProps 
)(Friend);