import fileSelect from 'file-select';

interface UploadArg {
  type: string
  multiple: boolean
}

declare global {
  interface Window {
    File?: any
    FileReader?: any
    FileList?: any
  }
}

export const upload = ({type, multiple = false}: UploadArg): Promise<File | FileList> => {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    return Promise.reject(new Error('Your browser does not support file uploading'));
  }

  return fileSelect({
    accept: type,
    multiple
  });
};

// TODO - Abstract away logic from FileList and File in convertToText

export const convertToText = (data: File | FileList): Promise<{name: string, text: string}[]> => {
  if (data === undefined || data === null) {
    return undefined;
  }

  if (data.constructor === FileList) {
    return Promise.all(
      Array.from(data as FileList).map((file) => (
        new Promise<{name: string, text: string}>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (result: any) => { // TODO - Remove 'any'
            const text = result.currentTarget.result;
            resolve({name: file.name, text});
          };
          reader.onerror = (err) => reject(err);
          reader.readAsText(file);
        })
      ))
    );
  }

  if (data.constructor === File) {
    const file = data as File;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (result: any) => { // TODO - Remove 'any'
        const text = result.currentTarget.result;
        resolve([{name: file.name, text}]);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }
};
