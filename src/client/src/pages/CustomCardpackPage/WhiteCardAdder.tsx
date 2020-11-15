import {
  Button,
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField
} from '@material-ui/core';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
import {useState} from 'react';
import {CustomWhiteCard} from '../../../../../proto-gen-out/api/model_pb';
import {useGlobalStyles} from '../../styles/globalStyles';

const lightTheme = createMuiTheme({palette: {type: 'light'}});

interface WhiteCardAdderProps {
  addCard(card: CustomWhiteCard): void;
}

const WhiteCardAdder = (props: WhiteCardAdderProps) => {
  const [card, setCard] = useState(new CustomWhiteCard());
  const globalClasses = useGlobalStyles();

  const submit = () => {
    props.addCard(card);
    setCard(new CustomWhiteCard());
  };

  const isSubmittable = card.getText().length > 0;

  return (
    <MuiThemeProvider theme={lightTheme}>
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

export default WhiteCardAdder;
