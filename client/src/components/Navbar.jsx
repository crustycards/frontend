import React from 'react';
import AppBar from 'material-ui/AppBar';

class Navbar extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <AppBar
        title="Title"
        onLeftIconButtonTouchTap={console.log}
      />
    )
  }
}

export default Navbar;