import {Card, CardContent, Typography} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import * as React from 'react';
import {DefaultBlackCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

const darkTheme = createTheme({palette: {mode: 'dark'}});

interface CAHDefaultBlackCardProps {
  card: DefaultBlackCard;
  hideAnswerCount?: boolean;
  overrideTextElements?: (string | JSX.Element)[];
}

const CAHDefaultBlackCard = (props: CAHDefaultBlackCardProps) => {
  const globalClasses = useGlobalStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <Card className={globalClasses.card}>
        <CardContent>
          <Typography align={'left'} gutterBottom variant={'h6'}>
            {props.overrideTextElements || props.card.getText()}
          </Typography>
          {
            !props.hideAnswerCount &&
            <Typography
              align={'left'}
              color={'textSecondary'}
              variant={'body1'}
            >
              {`Answers: ${props.card.getAnswerFields()}`}
            </Typography>
          }
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default CAHDefaultBlackCard;
