// Define the file metadata during the upload
export interface UploadedFileMeta {
    file: File;
    uploadProgress: number;
    status: 'pending' | 'uploading' | 'completed' | 'failed';
    error?: string;
  }
  
  // Define the state for file upload metadata
  export interface UploadState {
    uploadedFiles: UploadedFileMeta[]; // List of uploaded file metadata
    isLoading: boolean; // To track if any file is being uploaded
    error: string | null; // To track global errors
  }
  