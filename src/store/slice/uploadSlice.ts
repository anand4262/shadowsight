import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadedFileMeta, UploadState } from '@/store/types/uploadTypes';

const initialState: UploadState = {
  uploadedFiles: [],
  isLoading: false,
  error: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    // Add a file to the uploaded files array
    addUploadedFile: (state, action: PayloadAction<UploadedFileMeta>) => {
      if (state.uploadedFiles.length < 5) {
        state.uploadedFiles.push(action.payload);
      } else {
        state.error = 'You can upload up to 5 files only.';
      }
    },
    // Update the progress of file upload
    updateProgress: (state, action: PayloadAction<{ fileName: string; progress: number }>) => {
      const file = state.uploadedFiles.find(f => f.fileName === action.payload.fileName);
      if (file) {
        file.uploadProgress = action.payload.progress;
        file.status = file.uploadProgress === 100 ? 'completed' : 'uploading';
      }
    },
    // Set file upload status to failed
    setFileError: (state, action: PayloadAction<{ fileName: string; error: string }>) => {
      const file = state.uploadedFiles.find(f => f.fileName === action.payload.fileName);
      if (file) {
        file.status = 'failed';
        file.error = action.payload.error;
      }
    },
    // Remove a file from the uploaded files list
    removeUploadedFile: (state, action: PayloadAction<string>) => {
      state.uploadedFiles = state.uploadedFiles.filter(f => f.fileName !== action.payload);
    },
    // Clear all uploaded files
    clearAllUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },
  },
});

export const { addUploadedFile, updateProgress, setFileError, removeUploadedFile, clearAllUploadedFiles } = uploadSlice.actions;
export default uploadSlice.reducer;
