import * as React from 'react';
import {Component} from 'react';
const pressed = require('./pressed.png');
const unpressed = require('./unpressed.png');

const style = {
  transition: 'background-color 0.218s, border-color 0.218s, box-shadow 0.218s',
  outline: 'none',
  borderRadius: '3px',
  WebkitFilter: 'drop-shadow(2px 2px 3px #555)'
};

interface GoogleButtonProps {
  onClick?(): void;
}

interface GoogleButtonState {
  imageSrc: string;
}

class GoogleButton extends Component<GoogleButtonProps, GoogleButtonState> {
  constructor(props: GoogleButtonProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.clickRelease = this.clickRelease.bind(this);
    this.state = {
      imageSrc: unpressed
    };
  }

  public onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
    this.setState({imageSrc: pressed});
  }

  public clickRelease() {
    this.setState({imageSrc: unpressed});
  }

  public render() {
    return <input
      onMouseDown={this.onClick}
      onMouseUp={this.clickRelease}
      type='image'
      src={this.state.imageSrc}
      style={style}
    />;
  }
}

export default GoogleButton;
