import {Button, CircularProgress, TextField} from '@material-ui/core';
import * as React from 'react';
import {useState} from 'react';
import {CustomCardpack, User} from '../../../../proto-gen-out/crusty_cards_api/model_pb';
import {createCustomCardpack} from '../api/cardpackService';

interface CustomCardpackCreatorProps {
  user: User;
  onSubmit?(customCardpack: CustomCardpack): void;
}

const CustomCardpackCreator = (props: CustomCardpackCreatorProps) => {
  const [customCardpackName, setCustomCardpackName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCardpackNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCardpackName(e.target.value);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsLoading(true);
      const customCardpack = new CustomCardpack();
      customCardpack.setDisplayName(customCardpackName);
      createCustomCardpack(props.user.getName(), customCardpack)
          .then((cardpack) => {
            setIsLoading(false);
            setCustomCardpackName('');
            if (props.onSubmit) {
              props.onSubmit(cardpack);
            }
          });
    }}>
      <TextField
        label={'Cardpack Name'}
        value={customCardpackName}
        onChange={handleCardpackNameChange}
      />
      <br/>
      <Button
        type={'submit'}
        disabled={customCardpackName === '' || isLoading}
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

export default CustomCardpackCreator;
