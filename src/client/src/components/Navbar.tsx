import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import ViewListIcon from '@mui/icons-material/ViewList';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StoreState} from '../store';
import {closeNavbar, openNavbar} from '../store/modules/global';

const redirectTo = (url: string) => {
  window.location.replace(url);
};

const Navbar = () => {
  const {
    isOpen,
    user
  } = useSelector(({global: {navbarOpen, user}}: StoreState) => ({
    isOpen: navbarOpen,
    user
  }));

  const dispatch = useDispatch();

  return <div>
    <AppBar position={'static'}>
      <Toolbar>
        <IconButton
          edge={'start'}
          sx={{mr: 2}}
          onClick={() => dispatch(openNavbar())}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant={'h6'} color={'inherit'} sx={{flex: 1}}>
          Crusty Cards
        </Typography>
        <Button
          color={'secondary'}
          variant={'contained'}
          onClick={() => dispatch(push('/game'))}
        >
          Current Game
        </Button>
      </Toolbar>
    </AppBar>
    <Drawer open={isOpen} onClose={() => dispatch(closeNavbar())}>
      {user ?
        <div>
          {[
            {
              to: `/${user.getName()}`,
              onClick: () => dispatch(closeNavbar()),
              icon: <PersonIcon/>,
              text: 'Profile'
            },
            {
              to: '/game',
              onClick: () => dispatch(closeNavbar()),
              icon: <VideogameAssetIcon/>,
              text: 'Current Game'
            },
            {
              to: '/gamelist',
              onClick: () => dispatch(closeNavbar()),
              icon: <ViewListIcon/>,
              text: 'Find/Create a Game'
            },
            {
              to: '/settings',
              onClick: () => dispatch(closeNavbar()),
              icon: <SettingsIcon/>,
              text: 'Settings'
            }
          ].map(({to, onClick, icon, text}, index) => (
              <ListItem key={index} button onClick={() => {
                onClick();
                dispatch(push(to));
              }}>
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
          ))}
          <Divider/>
          <ListItem button onClick={() => redirectTo('/logout')}>
            <ListItemIcon>
              <ExitToAppIcon/>
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItem>
        </div>
        :
        <div>
          <ListItem button onClick={() => redirectTo('/login')}>
            <ListItemIcon>
              <ExitToAppIcon/>
            </ListItemIcon>
            <ListItemText primary={'Login'} />
          </ListItem>
        </div>}
    </Drawer>
  </div>;
};

export default Navbar;
