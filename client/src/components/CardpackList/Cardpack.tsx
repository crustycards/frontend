import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {Button, Card, CardHeader, CardActions} from '@material-ui/core';
import {convertTime} from '../../helpers/time';
import {ApiContextWrapper} from '../../api/context';
import { Cardpack as CardpackModel } from '../../api/dao';
import Api from '../../api/model/api';

const navItemStyle = {textDecoration: 'none'};

interface CardpackProps {
  api: Api
  cardpack: CardpackModel
  canDelete: boolean
}

const Cardpack = (props: CardpackProps) => (
  <Card className='card'>
    <CardHeader
      title={props.cardpack.name}
      subheader={`Created ${convertTime(props.cardpack.createdAt)}`}
    />
    <CardActions>
      <NavLink to={`/cardpack?id=${props.cardpack.id}`} style={navItemStyle}>
        <Button>
          View
        </Button>
      </NavLink>
      {
        props.canDelete &&
        <Button onClick={() => props.api.main.deleteCardpack(props.cardpack.id)}>
          Delete
        </Button>
      }
    </CardActions>
  </Card>
);

export default ApiContextWrapper(Cardpack);
