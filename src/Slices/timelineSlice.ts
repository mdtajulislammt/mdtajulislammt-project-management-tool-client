import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
}

interface TimelineState {
  events: TimelineEvent[];
}

const initialState: TimelineState = {
  events: [],
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<TimelineEvent>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
  },
});

export const { addEvent, removeEvent } = timelineSlice.actions;
export default timelineSlice.reducer; 