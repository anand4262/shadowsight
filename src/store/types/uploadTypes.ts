export interface UploadedFileMeta {
  fileName: string;              // The name of the file (e.g., 'activity_report.csv')
  fileSize: number;              // The size of the file in bytes
  uploadProgress: number;        // Upload progress (0 to 100)
  status: 'pending' | 'uploading' | 'completed' | 'failed';  // Status of the file upload
  error?: string;                // Optional error message if upload fails
}

export interface UploadState {
  uploadedFiles: UploadedFileMeta[];  // List of uploaded files with metadata
  isLoading: boolean;                 // Flag to track if loading is happening
  error: string | null;               // Any error that occurs during the upload process
}
