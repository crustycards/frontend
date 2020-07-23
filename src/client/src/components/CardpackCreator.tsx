import {Button, CircularProgress, TextField} from '@material-ui/core';
import * as React from 'react';
import {useState} from 'react';
import {Cardpack, User} from '../../../../proto-gen-out/api/model_pb';
import {createCardpack} from '../api/cardpackService';

interface CardpackCreatorProps {
  user: User;
  onSubmit?(cardpack: Cardpack): void;
}

const CardpackCreator = (props: CardpackCreatorProps) => {
  const [cardpackName, setCardpackName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCardpackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardpackName(e.target.value);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsLoading(true);
      const cardpack = new Cardpack();
      cardpack.setDisplayName(cardpackName);
      createCardpack(props.user.getName(), cardpack)
          .then((cardpack) => {
            setIsLoading(false);
            setCardpackName('');
            if (props.onSubmit) {
              props.onSubmit(cardpack);
            }
          });
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
      {
        isLoading &&
          <CircularProgress size={25} style={{verticalAlign: 'sub'}}/>
      }
    </form>
  );
};

export default CardpackCreator;
