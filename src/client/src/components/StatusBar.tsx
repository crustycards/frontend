import {Snackbar} from '@material-ui/core';
import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {hideStatusMessage} from '../store/modules/global';

interface StatusBarProps {
  isVisible: boolean;
  message: string;
  hideStatusMessage(): void;
}

const StatusBar = (props: StatusBarProps) => (
  <Snackbar
    open={props.isVisible}
    message={props.message}
    autoHideDuration={2500}
    onClose={props.hideStatusMessage}
    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
  />
);

const mapStateToProps = ({global}: any) => ({
  message: global.statusMessage,
  isVisible: global.statusVisible
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  hideStatusMessage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);
