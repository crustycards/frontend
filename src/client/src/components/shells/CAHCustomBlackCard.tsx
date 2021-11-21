import {Button, Card, CardActions, CardContent, Typography} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import * as React from 'react';
import {CustomBlackCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {deleteCustomBlackCard} from '../../api/cardpackService';
import {useGlobalStyles} from '../../styles/globalStyles';

const darkTheme = createTheme({palette: {mode: 'dark'}});

interface CAHCustomBlackCardProps {
  card: CustomBlackCard;
  showDeleteButton?: boolean;
  hideAnswerCount?: boolean;
  overrideTextElements?: (string | JSX.Element)[];
  onDelete?(cardId: string): void;
}

const CAHCustomBlackCard = (props: CAHCustomBlackCardProps) => {
  const removeCard = () => {
    deleteCustomBlackCard(props.card.getName()).then((data) => {
      if (props.onDelete) {
        props.onDelete(props.card.getName());
      }
    });
  };

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
        <CardActions>
          {
            props.showDeleteButton &&
              <Button onClick={removeCard}>Delete</Button>
          }
        </CardActions>
      </Card>
    </ThemeProvider>
  );
};

export default CAHCustomBlackCard;
