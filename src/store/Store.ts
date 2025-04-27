// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import CSVReducer from './CSVSlice';

const store = configureStore({
  reducer: {
    csv: CSVReducer, 
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch =  AppStore['dispatch']
export default store;
