import React from 'react';
import api from '../../apiInterface';
import { NavLink } from 'react-router-dom';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import time from 'time-converter';
const navItemStyle = {textDecoration: 'none'};
const deleteCardpack = (id) => {
  api.delete(`/cardpack/${id}`);
};

const Cardpack = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.cardpack.name}
      subtitle={'Created ' + time.stringify(props.cardpack.createdAt, {relativeTime: true})}
    />
    <CardActions>
      <NavLink to={`/cardpacks?id=${props.cardpack.id}`} style={navItemStyle}>
        <FlatButton label='Edit' />
      </NavLink>
      <FlatButton label='Delete' onClick={deleteCardpack.bind(null, props.cardpack.id)} />
    </CardActions>
  </Card>
);

export default Cardpack;