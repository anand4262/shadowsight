// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import CSVReducer from './slices/CSVSlice';
import uploadReducer from '@/store/slices/uploadSlice'
import GraphComponentSlice from "@/store/slices/GraphComponentSlice"

const store = configureStore({
  reducer: {
    csv: CSVReducer, 
    uploads: uploadReducer,
    selected: GraphComponentSlice
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch =  AppStore['dispatch']
export default store;
