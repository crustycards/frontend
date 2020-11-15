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
  Typography,
  Theme
} from '@material-ui/core';
import ExitToApp from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import Person from '@material-ui/icons/Person';
import Settings from '@material-ui/icons/Settings';
import VideogameAsset from '@material-ui/icons/VideogameAsset';
import ViewList from '@material-ui/icons/ViewList';
import {makeStyles, createStyles} from '@material-ui/styles';
import {push} from 'connected-react-router';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StoreState} from '../store';
import {closeNavbar, openNavbar} from '../store/modules/global';

const redirectTo = (url: string) => {
  window.location.replace(url);
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      flex: 1
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20
    }
  })
);

const Navbar = () => {
  const classes = useStyles();

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
          className={classes.menuButton}
          color={'inherit'}
          aria-label={'Menu'}
          onClick={() => dispatch(openNavbar())}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant={'h6'} color={'inherit'} className={classes.flex}>
          Cards
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
              icon: <Person/>,
              text: 'Profile'
            },
            {
              to: '/game',
              onClick: () => dispatch(closeNavbar()),
              icon: <VideogameAsset/>,
              text: 'Current Game'
            },
            {
              to: '/gamelist',
              onClick: () => dispatch(closeNavbar()),
              icon: <ViewList/>,
              text: 'Find/Create a Game'
            },
            {
              to: '/settings',
              onClick: () => dispatch(closeNavbar()),
              icon: <Settings/>,
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
              <ExitToApp/>
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItem>
        </div>
        :
        <div>
          <ListItem button onClick={() => redirectTo('/login')}>
            <ListItemIcon>
              <ExitToApp/>
            </ListItemIcon>
            <ListItemText primary={'Login'} />
          </ListItem>
        </div>}
    </Drawer>
  </div>;
};

export default Navbar;
