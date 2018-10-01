import {Button} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import { FileWithPreview } from 'react-dropzone';
import {ApiContextWrapper} from '../api/context';
import Api from '../api/model/api';
import FileUploader from './FileUploader';

interface UploaderProps {
  api: Api;
}

interface UploaderState {
  showDialogBox: boolean;
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

  public openDialog() {
    this.setState({showDialogBox: true});
  }

  public closeDialog() {
    this.setState({showDialogBox: false});
  }

  public async handleUpload(acceptedFiles: FileWithPreview[], rejectedFiles: FileWithPreview[], event: React.DragEvent<HTMLDivElement>) {
    if (acceptedFiles.length === 1 && rejectedFiles.length === 0) {
      const file = acceptedFiles[0];
      await this.props.api.main.setProfileImage(file.slice());
      this.closeDialog();
    }
  }

  public render() {
    return (
      <div>
        <Button variant={'outlined'} onClick={this.openDialog}>
          Upload Profile Picture
        </Button>
        <FileUploader
          titleText={'Upload Profile Picture'}
          type={'image/*'}
          onUpload={this.handleUpload}
          onClose={this.closeDialog}
          isVisible={this.state.showDialogBox}
        />
      </div>
    );
  }
}

export default ApiContextWrapper(ProfileImageUploader);
