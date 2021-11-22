import * as React from 'react';
import {Typography} from '@mui/material';

export default (props: {resourceType: string}) => {
  return (
    <Typography
      variant={'h3'}
    >
      {props.resourceType} Not Found
    </Typography>
  );
}