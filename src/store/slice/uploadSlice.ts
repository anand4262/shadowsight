// /store/slice/uploadSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadedFileMeta, UploadState } from "@/store/types/uploadTypes";

// Initial state
const initialState: UploadState = {
  uploadedFiles: [],
  isLoading: false,
  error: null,
};

// Create the slice
const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    // Action to add a file to the uploaded files array
    addUploadedFile: (state, action: PayloadAction<UploadedFileMeta>) => {
      if (state.uploadedFiles.length < 5) {
        state.uploadedFiles.push(action.payload);
      } else {
        state.error = 'You can upload up to 5 files only.';
      }
    },

    // Action to update the progress of file upload
    updateProgress: (state, action: PayloadAction<{ fileName: string; progress: number }>) => {
      const file = state.uploadedFiles.find(f => f.file.name === action.payload.fileName);
      if (file) {
        file.uploadProgress = action.payload.progress;
        file.status = file.uploadProgress === 100 ? 'completed' : 'uploading';
      }
    },

    // Action to set the file as failed
    setFileError: (state, action: PayloadAction<{ fileName: string; error: string }>) => {
      const file = state.uploadedFiles.find(f => f.file.name === action.payload.fileName);
      if (file) {
        file.status = 'failed';
        file.uploadProgress = 0; // Reset the progress to 0
        file.error = action.payload.error;
      }
    },

    // Action to remove a file from the uploaded files list
    removeFile: (state, action: PayloadAction<string>) => {  // Remove a specific file
      state.uploadedFiles = state.uploadedFiles.filter(f => f.file.name !== action.payload);
    },

    // Action to clear all files from the uploaded files list
    clearAllUploadedFiles: (state) => {  // Reset the uploaded files array
      state.uploadedFiles = [];
    },
  },
});

// Export actions
export const { addUploadedFile, updateProgress, setFileError, removeFile, clearAllUploadedFiles } = uploadSlice.actions;  // Ensure all actions are exported
export default uploadSlice.reducer;
