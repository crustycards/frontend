import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import Dropzone, { FileWithPreview } from 'react-dropzone';

interface UploaderProps {
  titleText?: string
  onUpload(
      acceptedFiles: FileWithPreview[],
      rejectedFiles: FileWithPreview[],
      event: React.DragEvent<HTMLDivElement>
  ): void
  onClose?(): void
  isVisible: boolean
}

const FileUploader = (props: UploaderProps) => (
  <Dialog open={props.isVisible} fullWidth={true} onClose={props.onClose || (() => {})}>
    {props.titleText && <DialogTitle>{props.titleText}</DialogTitle>}
    <DialogContent>
      <Dropzone
        style={{
          height: '100px',
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
        onDrop={props.onUpload}
        accept={'image/*'}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: 0,
          transform: 'translate(-50%, -50%)'
        }}>
          <DialogContentText>Drop Here (Or click to select)</DialogContentText>
        </div>
      </Dropzone>
    </DialogContent>
  </Dialog>
);

export default FileUploader;