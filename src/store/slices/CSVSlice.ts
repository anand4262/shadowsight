// /src/store/slices/csvSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CSVState, CSVRecord } from "../types/CSVTypes";

// Initial state with data mapped by file name (or unique ID)
const initialState: CSVState = {
  data: {},  // Change from CSVRecord[] to { [fileName: string]: CSVRecord[] }
  isLoading: false,
  error: null,
  processedData: {},
};

const CSVSlice = createSlice({
  name: 'CSVRecords',
  initialState,
  reducers: {
    // Add data per file
    setCsvData: (
      state,
      action: PayloadAction<{ fileName: string; records: CSVRecord[] }>
    ) => {
      const { fileName, records } = action.payload;
      state.data[fileName] = records;
    },

    // Remove data for a specific file
    removeCsvDataForFile: (
      state,
      action: PayloadAction<{ fileName: string }>
    ) => {
      delete state.data[action.payload.fileName];
    },

    // Clear entire store
    resetState: (state) => {
      state.data = {};
      state.isLoading = false;
      state.error = null;
      state.processedData = {};
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setProcessedData: (
      state,
      action: PayloadAction<{ [key: string]: number }>
    ) => {
      state.processedData = action.payload;
    },
  },
});

export const {
  setCsvData,
  removeCsvDataForFile,
  resetState,
  setLoading,
  setError,
  setProcessedData,
} = CSVSlice.actions;

export default CSVSlice.reducer;
