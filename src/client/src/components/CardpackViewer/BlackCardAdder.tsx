import {
  Button,
  Card,
  Typography,
  CardContent,
  CardActions,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
import {useState} from 'react';
import {BlackCard} from '../../../../../proto-gen-out/api/model_pb';

const darkTheme = createMuiTheme({palette: {type: 'dark'}});

interface BlackCardAdderProps {
  addCard(card: BlackCard): void;
}

const getDefaultNewBlackCard = () => {
  const card = new BlackCard();
  card.setAnswerFields(1);
  return card;
};

const BlackCardAdder = (props: BlackCardAdderProps) => {
  const [card, setCard] = useState(getDefaultNewBlackCard());

  const submit = () => {
    props.addCard(card);
    setCard(getDefaultNewBlackCard());
  };

  const isSubmittable = card.getText().length > 0 && card.getAnswerFields() > 0;

  return (
    <MuiThemeProvider theme={darkTheme}>
      <Card className='card'>
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
    </MuiThemeProvider>
  );
}

export default BlackCardAdder;
