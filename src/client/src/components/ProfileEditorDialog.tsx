import {
  Dialog,
  DialogContent,
  DialogTitle,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Theme,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {createStyles, makeStyles} from '@material-ui/styles';
import * as React from 'react';
import ProfileImageUploader from './ProfileImageUploader';
import UsernameChanger from './UsernameChanger';
import {useUserService} from '../api/context';
import {User} from '../../../../proto-gen-out/api/model_pb';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    }
  })
);

interface ProfileEditorDialogProps {
  currentUser: User;
  isVisible: boolean;
  onClose?(): void;
  onDisplayNameChange?(newDisplayName: string): void;
}

const ProfileEditorDialog = (props: ProfileEditorDialogProps) => {
  const userService = useUserService();
  const classes = useStyles();

  return (
    <Dialog
      open={props.isVisible}
      fullWidth={true}
      onClose={props.onClose || (() => null)}
    >
      <DialogTitle style={{textAlign: 'center'}}>Edit Profile</DialogTitle>
      <DialogContent>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            <Typography className={classes.heading}>
              Upload Profile Picture
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ProfileImageUploader
              userService={userService}
              currentUser={props.currentUser}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            <Typography className={classes.heading}>Change Username</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <UsernameChanger
              onSubmit={props.onDisplayNameChange || (() => null)}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditorDialog;
