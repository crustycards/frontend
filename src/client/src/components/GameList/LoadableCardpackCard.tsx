import * as React from 'react';
import {useState, useEffect} from 'react';
import {getCardpack} from '../../api/cardpackService';
import {Cardpack} from '../../../../../proto-gen-out/api/model_pb';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Typography
} from '@material-ui/core';
import {NavLink} from 'react-router-dom';

interface LoadableCardpackCardProps {
  cardpackName: string;
  onRemove: () => void
}

const LoadableCardpackCard = (props: LoadableCardpackCardProps) => {
  const [
    cardpack,
    setCardpack
  ] = useState<Cardpack | null | undefined>(undefined);

  useEffect(() => {
    setCardpack(undefined);
    getCardpack(props.cardpackName)
      .then(setCardpack)
      .catch(() => setCardpack(null));
  }, [props.cardpackName]);

  if (cardpack === undefined) {
    return (
      <Card className='card'>
        <CardContent>
          <CircularProgress/>
        </CardContent>
      </Card>
    );
  }

  if (cardpack === null) {
    return (
      <Card className='card'>
        <CardContent>
          <Typography>Could not load cardpack.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='card'>
      <CardContent>
        <Typography>{cardpack.getDisplayName()}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => props.onRemove()}>
          Remove
        </Button>
        <NavLink to={`/${cardpack.getName()}`} style={{textDecoration: 'none'}}>
          <Button>
            View
          </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
};

export default LoadableCardpackCard;