import * as React from 'react';
import {FileWithPath} from 'react-dropzone';
import {useUserService} from '../api/context';
import {UserService} from '../api/userService';
import FileUploader from './FileUploader';
import {User} from '../../../../proto-gen-out/crusty_cards_api/model_pb';

const blobToString = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.error) {
        reject(e.target.error);
      } else if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject('Missing onload event target or error');
      }
    };
    reader.readAsBinaryString(blob);
  });
};

const handleUpload = async (
  userService: UserService,
  userName: string,
  acceptedFiles: FileWithPath[],
  rejectedFiles: FileWithPath[]
) => {
  if (acceptedFiles.length === 1 && rejectedFiles.length === 0) {
    const file = acceptedFiles[0];
    await userService.updateCurrentUserProfileImage(await blobToString(file));
    // Refresh page so that the user can see their new profile picture.
    window.location.reload();
  }
};

interface ProfileImageUploaderProps {
  userService: UserService;
  currentUser: User;
}

const ProfileImageUploader = (props: ProfileImageUploaderProps) => {
  const userService = useUserService();

  return (
    <div style={{width: '100%'}}>
      <FileUploader
        type={'image/*'}
        onUpload={
          (acceptedFiles, rejectedFiles) => handleUpload(
            userService,
            props.currentUser.getName(),
            acceptedFiles,
            rejectedFiles
          )
        }
      />
    </div>
  );
};

export default ProfileImageUploader;
