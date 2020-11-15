import * as React from 'react';
import {useState, useEffect} from 'react';
import {getCustomCardpack} from '../../api/cardpackService';
import {CustomCardpack} from '../../../../../proto-gen-out/api/model_pb';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Typography
} from '@material-ui/core';
import {NavLink} from 'react-router-dom';
import {useGlobalStyles} from '../../styles/globalStyles';

interface LoadableCustomCardpackCardProps {
  customCardpackName: string;
  onRemove: () => void
}

const LoadableCustomCardpackCard = (props: LoadableCustomCardpackCardProps) => {
  const [
    customCardpack,
    setCustomCardpack
  ] = useState<CustomCardpack | null | undefined>(undefined);

  const globalClasses = useGlobalStyles();

  useEffect(() => {
    setCustomCardpack(undefined);
    getCustomCardpack(props.customCardpackName)
      .then(setCustomCardpack)
      .catch(() => setCustomCardpack(null));
  }, [props.customCardpackName]);

  if (customCardpack === undefined) {
    return (
      <Card className={globalClasses.card}>
        <CardContent>
          <CircularProgress/>
        </CardContent>
      </Card>
    );
  }

  if (customCardpack === null) {
    return (
      <Card className={globalClasses.card}>
        <CardContent>
          <Typography>Could not load custom cardpack.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={globalClasses.card}>
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