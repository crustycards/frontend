import {Card, CardContent, Typography} from '@mui/material';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
import {DefaultWhiteCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

const lightTheme = createMuiTheme({palette: {type: 'light'}});

interface CAHDefaultWhiteCardProps {
  card: DefaultWhiteCard;
}

const CAHDefaultWhiteCard = (props: CAHDefaultWhiteCardProps) => {
  const globalClasses = useGlobalStyles();

  return (
    <MuiThemeProvider theme={lightTheme}>
      <Card className={globalClasses.card}>
        <CardContent>
          <Typography align={'left'} variant={'body2'}>
            {props.card.getText()}
          </Typography>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
};

export default CAHDefaultWhiteCard;
