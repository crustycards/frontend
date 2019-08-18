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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    }
  })
);

interface ProfileEditorDialogProps {
  isVisible: boolean;
  onClose?(): void;
  onUsernameChange?(newUsername: string): void;
}

const ProfileEditorDialog = (props: ProfileEditorDialogProps) => {
  // TODO - Find a way to remove undefined argument here without getting a Typescript type error
  const classes = useStyles(undefined);

  return (
    <Dialog open={props.isVisible} fullWidth={true} onClose={props.onClose || (() => null)}>
      <DialogTitle style={{textAlign: 'center'}}>Edit Profile</DialogTitle>
      <DialogContent>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            <Typography className={classes.heading}>Upload Profile Picture</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ProfileImageUploader/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            <Typography className={classes.heading}>Change Username</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <UsernameChanger onSubmit={props.onUsernameChange ? props.onUsernameChange : (() => null)}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditorDialog;
