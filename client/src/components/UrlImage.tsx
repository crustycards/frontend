import * as React from 'react';
import {Component} from 'react';

interface UrlImageProps {
  url: string
  onLoad?(e: React.SyntheticEvent<HTMLImageElement>): void
  onError?(e: React.SyntheticEvent<HTMLImageElement>): void
  loadingView?: React.ReactNode
  style?: React.CSSProperties
  imageStyle?: React.CSSProperties
}

interface UrlImageState {
  isLoading: boolean
}

class UrlImage extends Component<UrlImageProps, UrlImageState> {
  constructor(props: UrlImageProps) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.handleLoad = this.handleLoad.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (this.props.onLoad) {
      this.props.onLoad(e);
    }
    this.setState({isLoading: false});
  }

  handleError(e: React.SyntheticEvent<HTMLImageElement>) {
    if (this.props.onError) {
      this.props.onError(e);
    }
    this.setState({isLoading: false});
  }

  render() {
    return (
      <div style={this.props.style}>
        <img
          src={this.props.url}
          onLoad={this.handleLoad}
          onError={this.handleError}
          style={this.props.imageStyle}
        />
        {
          this.state.isLoading && !!this.props.loadingView && this.props.loadingView
        }
      </div>
    );
  }
}

export default UrlImage;