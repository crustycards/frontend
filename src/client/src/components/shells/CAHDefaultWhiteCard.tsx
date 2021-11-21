import {Card, CardContent, Typography} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import * as React from 'react';
import {DefaultWhiteCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

const lightTheme = createTheme({palette: {mode: 'light'}});

interface CAHDefaultWhiteCardProps {
  card: DefaultWhiteCard;
}

const CAHDefaultWhiteCard = (props: CAHDefaultWhiteCardProps) => {
  const globalClasses = useGlobalStyles();

  return (
    <ThemeProvider theme={lightTheme}>
      <Card className={globalClasses.card}>
        <CardContent>
          <Typography align={'left'} variant={'body2'}>
            {props.card.getText()}
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default CAHDefaultWhiteCard;
