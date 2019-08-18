import {
  Theme,
  Typography,
  withStyles,
  WithStyles
} from '@material-ui/core';
import * as React from 'react';
import Dropzone, { FileWithPreview } from 'react-dropzone';

const styles = (theme: Theme) => ({
  text: {
    fontSize: theme.typography.pxToRem(18)
  },
  subtext: {
    fontSize: theme.typography.pxToRem(15)
  }
});

interface UploaderProps extends WithStyles<typeof styles> {
  type?: string;
  onUpload(
      acceptedFiles: FileWithPreview[],
      rejectedFiles: FileWithPreview[],
      event: React.DragEvent<HTMLDivElement>
  ): void;
}

const FileUploader = (props: UploaderProps) => (
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
    accept={props.type}
  >
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: 0,
      transform: 'translate(-50%, -50%)'
    }}>
      <Typography className={props.classes.text}>
        Drop Here
      </Typography>
      <Typography className={props.classes.subtext}>
        (Or click to select)
      </Typography>
    </div>
  </Dropzone>
);

export default withStyles(styles)(FileUploader);
