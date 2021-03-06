import * as React from 'react';
import {useState, useEffect} from 'react';
import {getCustomCardpack} from '../../api/cardpackService';
import {CustomCardpack} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';
import {NavLink} from 'react-router-dom';

interface LoadableCustomCardpackCardProps {
  customCardpackName: string;
  onRemove: () => void
}

const LoadableCustomCardpackCard = (props: LoadableCustomCardpackCardProps) => {
  const [
    customCardpack,
    setCustomCardpack
  ] = useState<CustomCardpack | null | undefined>(undefined);

  useEffect(() => {
    setCustomCardpack(undefined);
    getCustomCardpack(props.customCardpackName)
      .then(setCustomCardpack)
      .catch(() => setCustomCardpack(null));
  }, [props.customCardpackName]);

  if (customCardpack === undefined) {
    return (
      <Card>
        <CardContent>
          <CircularProgress/>
        </CardContent>
      </Card>
    );
  }

  if (customCardpack === null) {
    return (
      <Card>
        <CardContent>
          <Typography>Could not load custom cardpack.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography>{customCardpack.getDisplayName()}</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => props.onRemove()}>
          Remove
        </Button>
        <NavLink to={`/${customCardpack.getName()}`} style={{textDecoration: 'none'}}>
          <Button>
            View
          </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
};

export default LoadableCustomCardpackCard;