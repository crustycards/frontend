import * as React from 'react';
import {Component} from 'react';
import { FileWithPreview } from 'react-dropzone';
import {ApiContextWrapper} from '../api/context';
import Api from '../api/model/api';
import FileUploader from './FileUploader';

interface UploaderProps {
  api: Api;
}

class ProfileImageUploader extends Component<UploaderProps> {
  constructor(props: UploaderProps) {
    super(props);

    this.handleUpload = this.handleUpload.bind(this);
  }

  public render() {
    return (
      <div style={{width: '100%'}}>
        <FileUploader
          type={'image/*'}
          onUpload={this.handleUpload}
        />
      </div>
    );
  }

  private async handleUpload(
    acceptedFiles: FileWithPreview[],
    rejectedFiles: FileWithPreview[],
    event: React.DragEvent<HTMLDivElement>
  ) {
    if (acceptedFiles.length === 1 && rejectedFiles.length === 0) {
      const file = acceptedFiles[0];
      await this.props.api.main.setProfileImage(file.slice());
      window.location.reload(); // Refresh page so that the user can see their new profile picture
    }
  }
}

export default ApiContextWrapper(ProfileImageUploader);
