import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {openNavbar, closeNavbar} from '../store/modules/global';
import {Drawer, MenuItem, AppBar, Toolbar, Typography, Button, IconButton, ListItemIcon, ListItemText} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {NavLink} from 'react-router-dom';
import {Menu as MenuIcon, Home, ExitToApp, ViewList, VideogameAsset, Settings, ViewCarousel} from '@material-ui/icons';
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
        <IconButton className={props.classes.menuButton} color={'inherit'} aria-label={'Menu'} onClick={props.openNavbar}>
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
      {props.currentUser ?
        <div>
          <NavLink to='/' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} className={props.classes.menuItem}>
              <ListItemIcon className={props.classes.icon}>
                <Home/>
              </ListItemIcon>
              <ListItemText inset primary={'Home'} />
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
          <NavLink to='/cardpacks' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar} className={props.classes.menuItem}>
              <ListItemIcon className={props.classes.icon}>
                <ViewCarousel/>
              </ListItemIcon>
              <ListItemText inset primary={'Cardpacks'} />
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

const mapStateToProps = ({global, user}) => ({
  isOpen: global.navbarOpen,
  currentUser: user.currentUser
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openNavbar,
  closeNavbar
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StyledNavbar);
