import {
  Button,
  Card,
  Typography,
  CardContent,
  CardActions,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import * as React from 'react';
import {useState} from 'react';
import {CustomBlackCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

const darkTheme = createTheme({palette: {mode: 'dark'}});

interface BlackCardAdderProps {
  addCard(card: CustomBlackCard): void;
}

const getDefaultNewBlackCard = () => {
  const card = new CustomBlackCard();
  card.setAnswerFields(1);
  return card;
};

const BlackCardAdder = (props: BlackCardAdderProps) => {
  const [card, setCard] = useState(getDefaultNewBlackCard());
  const globalClasses = useGlobalStyles();

  const submit = () => {
    props.addCard(card);
    setCard(getDefaultNewBlackCard());
  };

  const isSubmittable = card.getText().length > 0 && card.getAnswerFields() > 0;

  return (
    <ThemeProvider theme={darkTheme}>
      <Card className={globalClasses.card}>
        <CardContent>
          <Typography align={'left'} gutterBottom variant={'h6'}>
            <TextField
              label='Text'
              type='text'
              value={card.getText()}
              onChange={(e) => {
                const newCard = card.clone();
                newCard.setText(e.target.value);
                setCard(newCard);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && isSubmittable) {
                  submit();
                }
              }}
              style={{padding: '5px'}}
            />
          </Typography>
          <Typography
            align={'left'}
            color={'textSecondary'}
            variant={'body1'}
            component={'div'}
          >
            {'Answers: '}
            <Select
              value={card.getAnswerFields()}
              onChange={(e) => {
                const newCard = card.clone();
                newCard.setAnswerFields(e.target.value as number);
                setCard(newCard);
              }}
            >
              <MenuItem value={1}>One</MenuItem>
              <MenuItem value={2}>Two</MenuItem>
              <MenuItem value={3}>Three</MenuItem>
            </Select>
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => submit()}
            disabled={!isSubmittable}
          >
            Create
          </Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default BlackCardAdder;
