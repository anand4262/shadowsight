// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import CSVReducer from './slice/CSVSlice';
import uploadReducer from '@/store/slice/uploadSlice'

const store = configureStore({
  reducer: {
    csv: CSVReducer, 
    uploads: uploadReducer
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch =  AppStore['dispatch']
export default store;
