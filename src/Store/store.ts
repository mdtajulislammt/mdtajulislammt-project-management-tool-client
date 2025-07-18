import { configureStore, combineReducers } from '@reduxjs/toolkit';
import taskReducer from '../slices/taskSlice';
import timelineReducer from '../slices/timelineSlice';
import { timelineApi } from '../services/timelineApi';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  tasks: taskReducer,
  timeline: timelineReducer,
  [timelineApi.reducerPath]: timelineApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(timelineApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 