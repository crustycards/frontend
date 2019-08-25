import {
  Theme,
  Typography,
  withStyles,
  WithStyles
} from '@material-ui/core';
import {CSSProperties} from '@material-ui/styles';
import * as React from 'react';
import {useMemo} from 'react';
import {FileWithPath, useDropzone} from 'react-dropzone';

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
      acceptedFiles: FileWithPath[],
      rejectedFiles: FileWithPath[],
      event: React.DragEvent<HTMLDivElement>
  ): void;
}

const baseStyle: CSSProperties = {
  height: '100px',
  padding: '10px',
  position: 'relative',
  borderWidth: '2px',
  borderColor: 'rgb(102, 102, 102)',
  borderStyle: 'dashed',
  borderRadius: '5px',
  textAlign: 'center',
  transition: 'all 0.2s ease-in'
};

const activeStyle: CSSProperties = {
};

const acceptStyle: CSSProperties = {
  backgroundColor: 'rgb(102, 205, 102)',
  borderColor: 'rgb(50, 50, 50)'
};

const rejectStyle: CSSProperties = {
  backgroundColor: 'rgb(205, 102, 102)',
  borderColor: 'rgb(50, 50, 50)'
};

const FileUploader = (props: UploaderProps) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({accept: props.type, onDrop: props.onUpload});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [isDragActive, isDragReject]);

  return <div {...getRootProps({style})}>
    <input {...getInputProps()}/>
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
  </div>;
};

export default withStyles(styles)(FileUploader);
