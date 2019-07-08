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
} from '@material-ui/core';
import {withStyles, WithStyles} from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Home from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import Person from '@material-ui/icons/Person';
// TODO - Change import below back to icons/Settings
import Settings from '@material-ui/icons/SettingsApplications';
import VideogameAsset from '@material-ui/icons/VideogameAsset';
import ViewList from '@material-ui/icons/ViewList';
import {push} from 'connected-react-router';
import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {User} from '../api/dao';
import {closeNavbar, openNavbar} from '../store/modules/global';

const navItemStyle = {textDecoration: 'none'};
const redirectTo = (url: string) => {
  window.location.replace(url);
};

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

interface NavbarProps extends WithStyles<typeof styles> {
  isOpen: boolean;
  user: User;
  openNavbar(): void;
  closeNavbar(): void;
  push(route: string): void;
}

const Navbar = (props: NavbarProps) => (
  <div>
    <AppBar position={'static'} style={{borderRadius: '5px'}}>
      <Toolbar>
        <IconButton
          className={props.classes.menuButton}
          color={'inherit'}
          aria-label={'Menu'}
          onClick={props.openNavbar}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant={'h6'} color={'inherit'} className={props.classes.flex}>
          Cards
        </Typography>
        <Button color={'secondary'} variant={'contained'} style={{color: 'white'}} onClick={() => props.push('/game')}>
          Current Game
        </Button>
      </Toolbar>
    </AppBar>
    <Drawer open={props.isOpen} onClose={() => props.closeNavbar()}>
      {props.user ?
        <div>
          {[
            {
              to: '/',
              onClick: props.closeNavbar,
              icon: <Home/>,
              text: 'Home'
            },
            {
              to: `/user?id=${props.user.id}`,
              onClick: props.closeNavbar,
              icon: <Person/>,
              text: 'Profile'
            },
            {
              to: '/game',
              onClick: props.closeNavbar,
              icon: <VideogameAsset/>,
              text: 'Current Game'
            },
            {
              to: '/gamelist',
              onClick: props.closeNavbar,
              icon: <ViewList/>,
              text: 'Find/Create a Game'
            },
            {
              to: '/settings',
              onClick: props.closeNavbar,
              icon: <Settings/>,
              text: 'Settings'
            }
          ].map(({to, onClick, icon, text}, index) => (
              <ListItem key={index} button onClick={() => {
                onClick();
                props.push(to);
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
          <ListItem button onClick={() => redirectTo('/logout')}>
            <ListItemIcon>
              <ExitToApp/>
            </ListItemIcon>
            <ListItemText primary={'Login'} />
          </ListItem>
        </div>}
    </Drawer>
  </div>
);

const StyledNavbar = withStyles(styles)(Navbar);

const mapStateToProps = ({global: {navbarOpen, user}}: any) => ({
  isOpen: navbarOpen,
  user
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  push,
  openNavbar,
  closeNavbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StyledNavbar);
