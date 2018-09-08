declare module 'file-select' {
  export default function(settings: {accept: string, multiple: boolean}): Promise<File | FileList>
}