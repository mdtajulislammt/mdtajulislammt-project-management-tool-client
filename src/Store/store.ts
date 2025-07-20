import { configureStore, combineReducers } from '@reduxjs/toolkit';
import taskReducer from '../slices/taskSlice';
import timelineReducer from '../slices/timelineSlice';
import userReducer from '../slices/userSlice';
import authReducer from '../slices/authSlice';
import { timelineApi } from '../services/timelineApi';
import { taskApi } from '../services/taskApi';
import { authApi } from '../services/authApi'; // ✅ Import authApi
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  tasks: taskReducer,
  timeline: timelineReducer,
  users: userReducer,
  auth: authReducer,

  [timelineApi.reducerPath]: timelineApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [authApi.reducerPath]: authApi.reducer, // ✅ Add here
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
    }).concat(
      timelineApi.middleware,
      taskApi.middleware,
      authApi.middleware // ✅ Add here
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
