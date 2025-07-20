import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  status?: number;
  // Relations (optional, can be arrays of IDs or objects)
  assignedTasks?: any[];
  createdTasks?: any[];
  comments?: any[];
  timelines?: any[];
  projects?: any[];
  presences?: any[];
  notification?: any[];
}

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const idx = state.users.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
  },
});

export const { addUser, updateUser, deleteUser } = userSlice.actions;
export default userSlice.reducer; 