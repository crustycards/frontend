import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import * as React from 'react';
import {User} from '../../../../../proto-gen-out/crusty_cards_api/model_pb';
import {useTheme} from '@mui/system';

interface UserListMenuProps {
  buttonText: string;
  buttonStyle: React.CSSProperties;
  users: User[];
  onUserSelect: (userName: string) => void;
}

const UserListMenu = (props: UserListMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const theme = useTheme();

  return (
    props.users.length ?
      <div style={{display: 'inline'}}>
        <Button
          variant='contained'
          color='secondary'
          style={props.buttonStyle}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {props.buttonText}
        </Button>
        <Menu
          elevation={0}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {
            props.users.map((user, index) => (
              <MenuItem
                // TODO - Verify that the root styles here are working.
                sx={{
                  root: {
                    '&:focus': {
                      'backgroundColor': theme.palette.secondary.main,
                      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                        color: theme.palette.common.white
                      }
                    }
                  }
                }}
                key={index}
                onClick={() => {
                  setAnchorEl(null);
                  props.onUserSelect(user.getName());
                }}
              >
                <ListItemIcon>
                  <SendIcon/>
                </ListItemIcon>
                <ListItemText primary={user.getDisplayName()} />
              </MenuItem>
            ))
          }
        </Menu>
      </div>
      :
      <Button
        variant='contained'
        color='secondary'
        style={props.buttonStyle}
        disabled={true}
      >
        {props.buttonText}
      </Button>
  );
};

export default UserListMenu;
