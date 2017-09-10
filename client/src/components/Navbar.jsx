import React from 'react';
import { Drawer, MenuItem, AppBar, FlatButton } from 'material-ui';
import { NavLink } from 'react-router-dom';
const navItemStyle = {textDecoration: 'none'};

class Navbar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    if (this.props.setToggle) {
      this.props.setToggle(this.handleToggle);
    }
    if (this.props.setClose) {
      this.props.setClose(this.handleClose);
    }
  }

  handleToggle () {
    this.setState({open: !this.state.open});
  }
  handleClose () {
    this.setState({open: false});
  }

  redirectTo (url) {
    if (!this.isCurrentUrl(url)) {
      window.location.replace(url);
    }
  }

  isCurrentUrl (url) {
    return (window.location.pathname === url);
  }

  render () {
    return (
      <div>
        <AppBar
          title="Title"
          onLeftIconButtonTouchTap={this.handleToggle}
          iconElementRight={
            <FlatButton 
              labelStyle={{ fontSize: '21px' }}
              onClick={this.redirectTo.bind(this, '/game')} 
              label="Game" 
            />
          }
        />
        <Drawer docked={false} width={250} open={this.state.open} onRequestChange={(open) => this.setState({open})}>
          <NavLink to='/' style={navItemStyle}>
            <MenuItem>Home</MenuItem>
          </NavLink>
          <NavLink to='/game' style={navItemStyle}>
            <MenuItem>Current Game</MenuItem>
          </NavLink>
          <NavLink to='/gamelist' style={navItemStyle}>
            <MenuItem>Find a Game</MenuItem>
          </NavLink>
          <MenuItem onClick={this.redirectTo.bind(this, '/logout')}>Logout</MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default Navbar;