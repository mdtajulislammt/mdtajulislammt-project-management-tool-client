import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../Slices/taskSlice';
import presenceReducer from '../Slices/presenceSlice';
import authReducer from '../Slices/authSlice';
import timelineReducer from '../Slices/timelineSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    presence: presenceReducer,
    auth: authReducer,
    timeline: timelineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 