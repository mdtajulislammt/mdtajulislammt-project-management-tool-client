import { configureStore, combineReducers } from '@reduxjs/toolkit';
import taskReducer from '../slices/taskSlice';
import timelineReducer from '../slices/timelineSlice';
import userReducer from '../slices/userSlice';
import authReducer from '../slices/authSlice';
import { timelineApi } from '../services/timelineApi';
import { taskApi } from '../services/taskApi';
import { authApi } from '../services/authApi';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userApi from '../services/userApi';
import projectApi from '../services/projectApi';

const rootReducer = combineReducers({
  tasks: taskReducer,
  timeline: timelineReducer,
  users: userReducer,
  auth: authReducer,

  [timelineApi.reducerPath]: timelineApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer, 
  [projectApi.reducerPath]: projectApi.reducer, 
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
      authApi.middleware,
      userApi.middleware,
      projectApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
