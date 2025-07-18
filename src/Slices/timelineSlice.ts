import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimelineTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  color: string;
}

export interface Dependency {
  id: string;
  fromTask: string;
  toTask: string;
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
}

interface TimelineState {
  tasks: TimelineTask[];
  dependencies: Dependency[];
}

const initialState: TimelineState = {
  tasks: [],
  dependencies: [],
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<TimelineTask[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<TimelineTask>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<TimelineTask>) => {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      state.dependencies = state.dependencies.filter(dep => dep.fromTask !== action.payload && dep.toTask !== action.payload);
    },
    setDependencies: (state, action: PayloadAction<Dependency[]>) => {
      state.dependencies = action.payload;
    },
    addDependency: (state, action: PayloadAction<Dependency>) => {
      state.dependencies.push(action.payload);
    },
    updateDependency: (state, action: PayloadAction<Dependency>) => {
      const idx = state.dependencies.findIndex(d => d.id === action.payload.id);
      if (idx !== -1) state.dependencies[idx] = action.payload;
    },
    deleteDependency: (state, action: PayloadAction<string>) => {
      state.dependencies = state.dependencies.filter(d => d.id !== action.payload);
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setDependencies,
  addDependency,
  updateDependency,
  deleteDependency,
} = timelineSlice.actions;
export default timelineSlice.reducer; 