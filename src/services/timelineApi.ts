import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TimelineTask, Dependency } from "../slices/timelineSlice";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api/";

export const timelineApi = createApi({
  reducerPath: "timelineApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["TimelineTask", "Dependency"],
  endpoints: (builder) => ({
    // Tasks
    getTimelineTasks: builder.query<TimelineTask[], void>({
      query: () => "/timeline/tasks",
      providesTags: ["TimelineTask"],
    }),
    getTimelineTask: builder.query<TimelineTask, string>({
      query: (id) => `/timeline/tasks/${id}`,
      providesTags: ["TimelineTask"],
    }),
    addTimelineTask: builder.mutation<TimelineTask, Partial<TimelineTask>>({
      query: (task) => ({
        url: "/timeline/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["TimelineTask"],
    }),
    updateTimelineTask: builder.mutation<TimelineTask, Partial<TimelineTask> & { id: string }>({
      query: ({ id, ...rest }) => ({
        url: `/timeline/tasks/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["TimelineTask"],
    }),
    deleteTimelineTask: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/timeline/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TimelineTask"],
    }),
    // Dependencies
    getDependencies: builder.query<Dependency[], void>({
      query: () => "/timeline/dependencies",
      providesTags: ["Dependency"],
    }),
    addDependency: builder.mutation<Dependency, Partial<Dependency>>({
      query: (dependency) => ({
        url: "/timeline/dependencies",
        method: "POST",
        body: dependency,
      }),
      invalidatesTags: ["Dependency"],
    }),
    updateDependency: builder.mutation<Dependency, Partial<Dependency> & { id: string }>({
      query: ({ id, ...rest }) => ({
        url: `/timeline/dependencies/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Dependency"],
    }),
    deleteDependency: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/timeline/dependencies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dependency"],
    }),
  }),
});

export const {
  useGetTimelineTasksQuery,
  useGetTimelineTaskQuery,
  useAddTimelineTaskMutation,
  useUpdateTimelineTaskMutation,
  useDeleteTimelineTaskMutation,
  useGetDependenciesQuery,
  useAddDependencyMutation,
  useUpdateDependencyMutation,
  useDeleteDependencyMutation,
} = timelineApi;

export default timelineApi; 