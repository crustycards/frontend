import * as React from 'react';
import {Component} from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core';
import Dropzone, { FileWithPreview } from 'react-dropzone';
import Api from '../api/model/api';
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
      this.props.api.main.setProfileImage(file.slice());
    }
  }

  render() {
    return (
      <div>
        <Button variant={'outlined'} onClick={this.openDialog}>
          Upload Profile Picture
        </Button>
        {
          this.state.showDialogBox &&
            <Dialog onClose={this.closeDialog} open={this.state.showDialogBox} fullWidth={true}>
              <DialogTitle>Upload Profile Picture</DialogTitle>
              <Dropzone
                style={{
                  height: '100px',
                  margin: '10px',
                  padding: '10px',
                  position: 'relative',
                  borderWidth: '2px',
                  borderColor: 'rgb(102, 102, 102)',
                  borderStyle: 'dashed',
                  borderRadius: '5px',
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in'
                }}
                rejectStyle={{
                  backgroundColor: 'rgb(205, 102, 102)',
                  borderColor: 'rgb(50, 50, 50)'
                }}
                onDrop={this.handleUpload}
                accept={'image/*'}
              >
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  margin: 0,
                  transform: 'translate(-50%, -50%)'
                }}>
                  Drop Here!
                </div>
              </Dropzone>
            </Dialog>
        }
      </div>
    );
  }
}

export default ApiContextWrapper(ProfileImageUploader);