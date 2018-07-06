import React from 'react';
import {Snackbar} from '@material-ui/core';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {hideStatusMessage} from '../store/modules/global';

const StatusBar = (props) => (
  <Snackbar
    open={props.isVisible}
    message={props.message}
    autoHideDuration={2500}
    onClose={props.hideStatusMessage}
    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
  />
);

const mapStateToProps = ({global}) => ({
  message: global.statusMessage,
  isVisible: global.statusVisible
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  hideStatusMessage
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);
