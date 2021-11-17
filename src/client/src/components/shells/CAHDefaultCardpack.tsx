import {
  Button,
  Card,
  CardActions,
  CardHeader
} from '@mui/material';
import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {DefaultCardpack} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

interface CAHDefaultCardpackProps {
  defaultCardpack: DefaultCardpack;
}

const CAHDefaultCardpack = (props: CAHDefaultCardpackProps) => {
  const globalClasses = useGlobalStyles();

  return (
    <div>
      <Card className={globalClasses.card}>
        <CardHeader
          title={props.defaultCardpack.getDisplayName()}
        />
        <CardActions>
          <NavLink
            to={`/${props.defaultCardpack.getName()}`}
            style={{textDecoration: 'none'}}
          >
            <Button>
              View
            </Button>
          </NavLink>
        </CardActions>
      </Card>
    </div>
  );
};

export default CAHDefaultCardpack;
