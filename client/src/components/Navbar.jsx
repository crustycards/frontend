import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {openNavbar, closeNavbar} from '../store/modules/global';
import {
  Drawer,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {NavLink} from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import Home from '@material-ui/icons/Home';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ViewList from '@material-ui/icons/ViewList';
import VideogameAsset from '@material-ui/icons/VideogameAsset';
import Settings from '@material-ui/icons/Settings';
import Person from '@material-ui/icons/Person';
import store from '../store';
import {push} from 'connected-react-router';

const navItemStyle = {textDecoration: 'none'};
const redirectTo = (url) => {
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

const Navbar = (props) => (
  <div>
    <AppBar position={'static'}>
      <Toolbar>
        <IconButton
          className={props.classes.menuButton}
          color={'inherit'}
          aria-label={'Menu'}
          onClick={props.openNavbar}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant={'title'} color={'inherit'} className={props.classes.flex}>
          Cards
        </Typography>
        <Button color={'inherit'} onClick={() => store.dispatch(push('/game'))}>
          Current Game
        </Button>
      </Toolbar>
    </AppBar>
    <Drawer open={props.isOpen} onClose={() => props.closeNavbar(false)}>
      {props.user ?
        <div>
          <NavLink to='/' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} className={props.classes.menuItem}>
              <ListItemIcon className={props.classes.icon}>
                <Home/>
              </ListItemIcon>
              <ListItemText inset primary={'Home'} />
            </MenuItem>
          </NavLink>
          <NavLink to={`/user?id=${props.user.id}`} style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} className={props.classes.menuItem}>
              <ListItemIcon className={props.classes.icon}>
                <Person/>
              </ListItemIcon>
              <ListItemText inset primary={'Profile'} />
            </MenuItem>
          </NavLink>
          <NavLink to='/game' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} className={props.classes.menuItem}>
              <ListItemIcon className={props.classes.icon}>
                <VideogameAsset/>
              </ListItemIcon>
              <ListItemText inset primary={'Current Game'} />
            </MenuItem>
          </NavLink>
          <NavLink to='/gamelist' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} className={props.classes.menuItem}>
              <ListItemIcon className={props.classes.icon}>
                <ViewList/>
              </ListItemIcon>
              <ListItemText inset primary={'Find a Game'} />
            </MenuItem>
          </NavLink>
          <NavLink to='/settings' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} className={props.classes.menuItem}>
              <ListItemIcon className={props.classes.icon}>
                <Settings/>
              </ListItemIcon>
              <ListItemText inset primary={'Settings'} />
            </MenuItem>
          </NavLink>
          <MenuItem onClick={() => redirectTo('/logout')} className={props.classes.menuItem}>
            <ListItemIcon className={props.classes.icon}>
              <ExitToApp/>
            </ListItemIcon>
            <ListItemText inset primary={'Logout'} />
          </MenuItem>
        </div>
        :
        <div>
          <NavLink to='/login' style={navItemStyle}>
            <MenuItem onClick={() => redirectTo('/logout')} className={props.classes.menuItem}>
            <ListItemIcon className={props.classes.icon}>
              <ExitToApp/>
            </ListItemIcon>
            <ListItemText inset primary={'Login'} />
          </MenuItem>
          </NavLink>
        </div>}
    </Drawer>
  </div>
);

const StyledNavbar = withStyles(styles)(Navbar);

const mapStateToProps = ({global: {navbarOpen, user}}) => ({
  isOpen: navbarOpen,
  user
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openNavbar,
  closeNavbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StyledNavbar);
