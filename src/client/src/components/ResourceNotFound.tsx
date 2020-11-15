import * as React from 'react';
import {Typography} from '@material-ui/core';

export default (props: {resourceType: string}) => {
  return (
    <Typography
      variant={'h3'}
    >
      {props.resourceType} Not Found
    </Typography>
  );
}