import {
  Dialog,
  DialogContent,
  DialogTitle,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Theme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useTheme} from '@mui/system';
import * as React from 'react';
import ProfileImageUploader from './ProfileImageUploader';
import UsernameChanger from './UsernameChanger';
import {useUserService} from '../api/context';
import {User} from '../../../../proto-gen-out/crusty_cards_api/model_pb';

interface ProfileEditorDialogProps {
  currentUser: User;
  isVisible: boolean;
  onClose?(): void;
  onDisplayNameChange?(newDisplayName: string): void;
}

const ProfileEditorDialog = (props: ProfileEditorDialogProps) => {
  const userService = useUserService();
  const theme: Theme = useTheme();

  const headingStyles = {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  };

  return (
    <Dialog
      open={props.isVisible}
      fullWidth={true}
      onClose={props.onClose || (() => null)}
    >
      <DialogTitle style={{textAlign: 'center'}}>Edit Profile</DialogTitle>
      <DialogContent>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            <Typography sx={headingStyles}>
              Upload Profile Picture
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ProfileImageUploader
              userService={userService}
              currentUser={props.currentUser}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            <Typography sx={headingStyles}>Change Username</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UsernameChanger
              onSubmit={props.onDisplayNameChange || (() => null)}
            />
          </AccordionDetails>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditorDialog;
