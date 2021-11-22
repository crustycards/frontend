import {Theme, Typography} from '@mui/material';
import {CSSProperties} from '@mui/material/styles/createTypography';
import {useTheme} from '@mui/system';
import * as React from 'react';
import {useMemo} from 'react';
import {FileWithPath, useDropzone} from 'react-dropzone';

interface UploaderProps {
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

  const theme: Theme = useTheme();

  const style: CSSProperties = useMemo(() => ({
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
      <Typography sx={{fontSize: theme.typography.pxToRem(18)}}>
        Drop Here
      </Typography>
      <Typography sx={{fontSize: theme.typography.pxToRem(15)}}>
        (Or click to select)
      </Typography>
    </div>
  </div>;
};

export default FileUploader;
