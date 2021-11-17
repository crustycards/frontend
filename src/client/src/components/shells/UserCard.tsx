import {Avatar, Button, Card, CardActions, CardHeader} from '@mui/material';
import * as React from 'react';
import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {User} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {useUserService} from '../../api/context';
import {stringToCssColor} from '../../helpers/colorGenerator';
import {useGlobalStyles} from '../../styles/globalStyles';

interface UserCardProps {
  user: User;
}

const UserCard = (props: UserCardProps) => {
  const [imgError, setImgError] = useState(false);
  const userService = useUserService();
  const globalClasses = useGlobalStyles();

  return (
    <Card className={globalClasses.card}>
      <CardHeader
        title={
          <div style={{height: '50px'}}>
            {
              imgError === false ?
                <Avatar
                  onError={() => setImgError(true)}
                  style={{float: 'left'}}
                  src={userService.getUserProfileImageUrl(props.user.getName())}
                />
                :
                <Avatar
                  style={{
                    float: 'left',
                    backgroundColor: stringToCssColor(props.user.getName())
                  }}
                >
                  {props.user.getDisplayName().charAt(0).toUpperCase()}
                </Avatar>
            }
            <div style={{padding: '5px 50px'}}>
              {props.user.getDisplayName()}
            </div>
          </div>
        }
      />
      <CardActions>
        <NavLink
          to={`/${props.user.getName()}`}
          style={{textDecoration: 'none'}}
        >
          <Button>
            View Profile
          </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
};

export default UserCard;
