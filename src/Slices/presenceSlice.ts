import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PresenceState {
  onlineUsers: string[];
}

const initialState: PresenceState = {
  onlineUsers: [],
};

const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(user => user !== action.payload);
    },
  },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser } = presenceSlice.actions;
export default presenceSlice.reducer; 