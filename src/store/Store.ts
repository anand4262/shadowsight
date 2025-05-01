// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import CSVReducer from './slice/CSVSlice';
import uploadReducer from '@/store/slice/uploadSlice'

const persistConfig = {
    key: 'root',  
    storage,     
  };

  const persistedReducer = persistReducer(persistConfig, CSVReducer);

const store = configureStore({
  reducer: {
    csv: persistedReducer, 
    uploads: uploadReducer
  },
});

export const persistor = persistStore(store);
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch =  AppStore['dispatch']
export default store;
