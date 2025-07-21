import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string | number;
  deadline?: string;
  assignedTo?: string;
  projectId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  assignedUser?: {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  };
  creator?: {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  };
  project?: {
    id: string;
    title: string;
    description: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  };
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = taskSlice.actions;
export default taskSlice.reducer; 