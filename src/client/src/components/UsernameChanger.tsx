import {Button, CircularProgress, TextField} from '@material-ui/core';
import {FieldMask} from 'google-protobuf/google/protobuf/field_mask_pb';
import * as React from 'react';
import {useState} from 'react';
import {User} from '../../../../proto-gen-out/api/model_pb';
import {UpdateUserRequest} from '../../../../proto-gen-out/api/user_service_pb';
import {useUserService} from '../api/context';

interface UsernameChangerProps {
  onSubmit?(username: string): void;
}

const UsernameChanger = (props: UsernameChangerProps) => {
  const [newUsername, setNewUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userService = useUserService();

  const setUsername = () => {
    setIsLoading(true);
    userService.updateCurrentUserDisplayName(newUsername)
        .then(() => {
          if (props.onSubmit) {
            props.onSubmit(newUsername);
          }

          setNewUsername('');
          setIsLoading(false);
        });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setUsername();
    }}>
      <TextField
        style={{marginTop: '0'}}
        label={'New Username'}
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <Button
        style={{margin: '13px 0 0 10px'}}
        color={'primary'}
        variant={'contained'}
        type={'submit'}
        disabled={newUsername === '' || isLoading}
      >
        {isLoading ? <CircularProgress size={24}/> : 'Save'}
      </Button>
    </form>
  );
};

export default UsernameChanger;
