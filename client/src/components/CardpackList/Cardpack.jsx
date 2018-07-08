import React from 'react';
import api from '../../apiInterface';
import {NavLink} from 'react-router-dom';
import {Button, Card, CardHeader, CardActions} from '@material-ui/core';
import time from 'time-converter';
const navItemStyle = {textDecoration: 'none'};

const Cardpack = (props) => (
  <Card className='card'>
    <CardHeader
      title={props.cardpack.name}
      subheader={'Created ' + time.stringify(props.cardpack.createdAt, {relativeTime: true})}
    />
    <CardActions>
      <NavLink to={`/cardpack?id=${props.cardpack.id}`} style={navItemStyle}>
        <Button>
          View
        </Button>
      </NavLink>
      <Button onClick={api.deleteCardpack.bind(null, props.cardpack.id)}>
        Delete
      </Button>
    </CardActions>
  </Card>
);

export default Cardpack;
