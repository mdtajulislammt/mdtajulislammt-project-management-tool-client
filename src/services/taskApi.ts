import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Task } from "../slices/taskSlice";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: ["Task"],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`, 
      providesTags: ["Task"],
    }),
    addTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<Task, Partial<Task> & { id: string }>({
      query: ({ id, ...rest }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;

export default taskApi; 