import {Button, Card, CardActions, CardContent, Typography} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import * as React from 'react';
import {CustomWhiteCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {deleteCustomWhiteCard} from '../../api/cardpackService';
import {useGlobalStyles} from '../../styles/globalStyles';

const lightTheme = createTheme({palette: {mode: 'light'}});

interface CAHCustomWhiteCardProps {
  card: CustomWhiteCard;
  showDeleteButton?: boolean;
  onDelete?(cardId: string): void;
}

// TODO - Display fields from CustomWhiteCard other than text.
const CAHCustomWhiteCard = (props: CAHCustomWhiteCardProps) => {
  const removeCard = () => {
    return deleteCustomWhiteCard(props.card.getName()).then((data) => {
      if (props.onDelete) {
        props.onDelete(props.card.getName());
      }
    });
  };

  const globalClasses = useGlobalStyles();

  return (
    <ThemeProvider theme={lightTheme}>
      <Card className={globalClasses.card}>
        <CardContent>
          <Typography align={'left'} variant={'body2'}>
            {props.card.getText()}
          </Typography>
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

export default CAHCustomWhiteCard;
