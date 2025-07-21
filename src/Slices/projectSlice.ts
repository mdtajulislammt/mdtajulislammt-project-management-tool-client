import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  order: number;
  startDate?: string;
  endDate?: string;
}

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const idx = state.projects.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.projects[idx] = action.payload;
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
  },
});

export const { setProjects, addProject, updateProject, deleteProject } = projectSlice.actions;
export default projectSlice.reducer; 