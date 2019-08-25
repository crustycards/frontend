import {Button, CircularProgress, TextField} from '@material-ui/core';
import * as React from 'react';
import {useState} from 'react';
import {useApi} from '../api/context';
import {Cardpack} from '../api/dao';

interface CardpackCreatorProps {
  onSubmit?(cardpack: Cardpack): void;
}

const CardpackCreator = (props: CardpackCreatorProps) => {
  const [cardpackName, setCardpackName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();

  const createCardpack = () => {
    setIsLoading(true);
    api.main.createCardpack(cardpackName)
        .then((cardpack) => {
          setIsLoading(false);
          setCardpackName('');

          if (props.onSubmit) {
            props.onSubmit(cardpack);
          }
        });
  };

  const handleCardpackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardpackName(e.target.value);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createCardpack();
    }}>
      <TextField
        label={'Cardpack Name'}
        value={cardpackName}
        onChange={handleCardpackNameChange}
      />
      <br/>
      <Button
        type={'submit'}
        disabled={cardpackName === '' || isLoading}
      >
        Create Cardpack
      </Button>
      {isLoading && <CircularProgress size={25} style={{verticalAlign: 'sub'}} />}
    </form>
  );
};

export default CardpackCreator;
