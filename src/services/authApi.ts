import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { baseQuery } from './apiBase';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";

console.log("BASE_URL",BASE_URL)

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ access_token: string; user: any }, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    registerUser: builder.mutation<any, { name: string; email: string; password: string }>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    me: builder.query<any, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useMeQuery,
} = authApi;

export default authApi;
