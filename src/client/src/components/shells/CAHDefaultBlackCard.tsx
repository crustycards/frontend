import {Card, CardContent, Typography} from '@mui/material';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
import {DefaultBlackCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

const darkTheme = createMuiTheme({palette: {type: 'dark'}});

interface CAHDefaultBlackCardProps {
  card: DefaultBlackCard;
  hideAnswerCount?: boolean;
  overrideTextElements?: (string | JSX.Element)[];
}

const CAHDefaultBlackCard = (props: CAHDefaultBlackCardProps) => {
  const globalClasses = useGlobalStyles();

  return (
    <MuiThemeProvider theme={darkTheme}>
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
    </MuiThemeProvider>
  );
};

export default CAHDefaultBlackCard;
