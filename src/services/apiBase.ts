import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5002',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('access_token');
    console.log('Token:', token);  // debug
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  
});
