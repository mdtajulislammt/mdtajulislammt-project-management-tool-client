import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Task } from "../slices/taskSlice";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";
console.log('task Base Url', BASE_URL)

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Task", "Comment"],
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
        method: "PATCH",
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
    addComment: builder.mutation<any, { taskId: string; comment: string }>({
      query: ({ taskId, comment }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: ["Comment"],
    }),
    getComments: builder.query<any[], string>({
      query: (taskId) => `/tasks/${taskId}/comments`,
      providesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddCommentMutation,
  useGetCommentsQuery,
} = taskApi;

export default taskApi; 