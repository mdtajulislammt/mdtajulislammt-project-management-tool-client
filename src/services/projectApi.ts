import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Project } from '../slices/projectSlice';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => '/projects',
      providesTags: ['Project'],
    }),
    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: ['Project'],
    }),
    addProject: builder.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation<Project, Partial<Project> & { id: string }>({
      query: ({ id, ...rest }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: rest,
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;

export default projectApi; 