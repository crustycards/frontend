import * as React from 'react';
import {useState, useEffect} from 'react';
import {getDefaultCardpack} from '../../api/cardpackService';
import {DefaultCardpack} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';
import {NavLink} from 'react-router-dom';

interface LoadableDefaultCardpackCardProps {
  defaultCardpackName: string;
  onRemove: () => void
}

const LoadableDefaultCardpackCard =
(props: LoadableDefaultCardpackCardProps) => {
  const [
    defaultCardpack,
    setDefaultCardpack
  ] = useState<DefaultCardpack | null | undefined>(undefined);

  useEffect(() => {
    setDefaultCardpack(undefined);
    getDefaultCardpack(props.defaultCardpackName)
      .then(setDefaultCardpack)
      .catch(() => setDefaultCardpack(null));
  }, [props.defaultCardpackName]);

  if (defaultCardpack === undefined) {
    return (
      <Card>
        <CardContent>
          <CircularProgress/>
        </CardContent>
      </Card>
    );
  }

  if (defaultCardpack === null) {
    return (
      <Card>
        <CardContent>
          <Typography>Could not load default cardpack.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography>{defaultCardpack.getDisplayName()}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => props.onRemove()}>
          Remove
        </Button>
        <NavLink to={`/${defaultCardpack.getName()}`} style={{textDecoration: 'none'}}>
          <Button>
            View
          </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
};

export default LoadableDefaultCardpackCard;