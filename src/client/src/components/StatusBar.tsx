import {Snackbar} from '@material-ui/core';
import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StoreState} from '../store';
import {hideStatusMessage} from '../store/modules/global';

const StatusBar = () => {
  const {message, isVisible} = useSelector(({global}: StoreState) => ({
    message: global.statusMessage,
    isVisible: global.statusVisible
  }));
  const dispatch = useDispatch();

  return <Snackbar
    open={isVisible}
    message={message}
    autoHideDuration={2500}
    onClose={() => dispatch(hideStatusMessage())}
    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
  />;
};

export default StatusBar;
