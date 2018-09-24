import * as React from 'react';
import {Component} from 'react';
import {Button} from '@material-ui/core';
import Dropzone, { FileWithPreview } from 'react-dropzone';
import Api from '../api/model/api';
import FileUploader from './FileUploader';
import {ApiContextWrapper} from '../api/context';

interface UploaderProps {
  api: Api
}

interface UploaderState {
  showDialogBox: boolean
}

class ProfileImageUploader extends Component<UploaderProps, UploaderState> {
  constructor(props: UploaderProps) {
    super(props);

    this.state = {
      showDialogBox: false
    };

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  openDialog() {
    this.setState({showDialogBox: true});
  }

  closeDialog() {
    this.setState({showDialogBox: false});
  }

  async handleUpload(acceptedFiles: FileWithPreview[], rejectedFiles: FileWithPreview[], event: React.DragEvent<HTMLDivElement>) {
    if (acceptedFiles.length === 1 && rejectedFiles.length === 0) {
      const file = acceptedFiles[0];
      await this.props.api.main.setProfileImage(file.slice());
      this.closeDialog();
    }
  }

  render() {
    return (
      <div>
        <Button variant={'outlined'} onClick={this.openDialog}>
          Upload Profile Picture
        </Button>
        <FileUploader
          titleText={'Upload Profile Picture'}
          onUpload={this.handleUpload}
          onClose={this.closeDialog}
          isVisible={this.state.showDialogBox}
        />
      </div>
    );
  }
}

export default ApiContextWrapper(ProfileImageUploader);