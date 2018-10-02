import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
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
import {NavLink} from 'react-router-dom';
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
        <Typography variant={'title'} color={'inherit'} className={props.classes.flex}>
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
          <NavLink to='/' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar}>
              <ListItemIcon>
                <Home/>
              </ListItemIcon>
              <ListItemText inset primary={'Home'} />
            </MenuItem>
          </NavLink>
          <NavLink to={`/user?id=${props.user.id}`} style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar}>
              <ListItemIcon>
                <Person/>
              </ListItemIcon>
              <ListItemText inset primary={'Profile'} />
            </MenuItem>
          </NavLink>
          <NavLink to='/game' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar}>
              <ListItemIcon>
                <VideogameAsset/>
              </ListItemIcon>
              <ListItemText inset primary={'Current Game'} />
            </MenuItem>
          </NavLink>
          <NavLink to='/gamelist' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar}>
              <ListItemIcon>
                <ViewList/>
              </ListItemIcon>
              <ListItemText inset primary={'Find a Game'} />
            </MenuItem>
          </NavLink>
          <NavLink to='/settings' style={navItemStyle}>
            <MenuItem onClick={props.closeNavbar}>
              <ListItemIcon>
                <Settings/>
              </ListItemIcon>
              <ListItemText inset primary={'Settings'} />
            </MenuItem>
          </NavLink>
          <MenuItem onClick={() => redirectTo('/logout')}>
            <ListItemIcon>
              <ExitToApp/>
            </ListItemIcon>
            <ListItemText inset primary={'Logout'} />
          </MenuItem>
        </div>
        :
        <div>
          <NavLink to='/login' style={navItemStyle}>
            <MenuItem onClick={() => redirectTo('/logout')}>
              <ListItemIcon>
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
