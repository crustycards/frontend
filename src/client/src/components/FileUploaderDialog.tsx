import {
  Dialog,
  DialogContent,
  DialogTitle,
  Theme,
  withStyles,
  WithStyles
} from '@mui/material';
import * as React from 'react';
import {FileWithPath} from 'react-dropzone';
import FileUploader from './FileUploader';

const styles = (theme: Theme) => ({
  text: {
    fontSize: theme.typography.pxToRem(18)
  },
  subtext: {
    fontSize: theme.typography.pxToRem(15)
  }
});

interface UploaderProps extends WithStyles<typeof styles> {
  titleText?: string;
  type?: string;
  isVisible: boolean;
  onUpload(
      acceptedFiles: FileWithPath[],
      rejectedFiles: FileWithPath[],
      event: React.DragEvent<HTMLDivElement>
  ): void;
  onClose?(): void;
}

const FileUploaderDialog = (props: UploaderProps) => (
  <Dialog
    open={props.isVisible}
    fullWidth={true}
    onClose={props.onClose || (() => null)}
  >
    {
      props.titleText &&
        <DialogTitle style={{textAlign: 'center'}}>
          {props.titleText}
        </DialogTitle>
    }
    <DialogContent>
      <FileUploader type={props.type} onUpload={props.onUpload}/>
    </DialogContent>
  </Dialog>
);

export default withStyles(styles)(FileUploaderDialog);
