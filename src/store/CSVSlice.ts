// /src/store/slices/csvSlice.ts
import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { CSVState, CSVRecord } from "./CSVTypes";  

// Initial state
const initialState: CSVState = {
  data: [],
  isLoading: false,
  error: null,
  processedData: {},
};

// Create slice for CSV data
const CSVSlice = createSlice({
  name: 'CSVRecords',
  initialState,
  reducers: {
    setCsvData: (state, action: PayloadAction<CSVRecord[]>) => {
      state.data = [...state.data, ...action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProcessedData: (state, action: PayloadAction<{ [key: string]: number }>) => {
      state.processedData = action.payload;
    },
    resetState: (state) => {
      // Reset the entire state when the "Clear" button is clicked
      state.data = [];
      state.isLoading = false;
      state.error = null;
      state.processedData = {};
    },
  },
});

export const { setCsvData, setLoading, setError, setProcessedData, resetState } = CSVSlice.actions;
export default CSVSlice.reducer;
