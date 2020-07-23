import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import * as React from 'react';
import {User} from '../../../../../proto-gen-out/api/model_pb';

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      'backgroundColor': theme.palette.secondary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

interface UserListMenuProps {
  buttonText: string;
  buttonStyle: React.CSSProperties;
  users: User[];
  onUserSelect: (userName: string) => void;
}

const UserListMenu = (props: UserListMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

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
          getContentAnchorEl={null}
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
              <StyledMenuItem
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
              </StyledMenuItem>
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
