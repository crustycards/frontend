import * as React from 'react';
import {Component} from 'react';
// TODO - Convert these import to esModules.
// This can be done by removing `esModule: false` in webpack.config.ts.
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

  public render() {
    return <input
      onMouseDown={this.onClick}
      onMouseUp={this.clickRelease}
      type='image'
      src={this.state.imageSrc}
      style={style}
    />;
  }

  private onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
    this.setState({imageSrc: pressed});
  }

  private clickRelease() {
    this.setState({imageSrc: unpressed});
  }
}

export default GoogleButton;
