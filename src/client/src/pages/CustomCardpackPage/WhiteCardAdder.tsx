import {
  Button,
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField
} from '@mui/material';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material/styles';
import * as React from 'react';
import {useState} from 'react';
import {CustomWhiteCard} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';

const lightTheme = createTheme({palette: {mode: 'light'}});

interface WhiteCardAdderProps {
  addCard(card: CustomWhiteCard): void;
}

const WhiteCardAdder = (props: WhiteCardAdderProps) => {
  const [card, setCard] = useState(new CustomWhiteCard());

  const submit = () => {
    props.addCard(card);
    setCard(new CustomWhiteCard());
  };

  const isSubmittable = card.getText().length > 0;

  return (
    <ThemeProvider theme={lightTheme}>
      <Card>
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

export default WhiteCardAdder;
