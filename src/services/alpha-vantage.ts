import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AlphaVantageDailyTimeSeriesResponse } from '../types/alpha-vantage-types';

// Should obviously not be in source code.
const API_KEY = 'DQFO7QLCWTYVWT5V';

export const alphaVantageApi = createApi({
  reducerPath: 'alphaVantageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.alphavantage.co/query',
  }),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getDailyAdjusted: builder.query<
      AlphaVantageDailyTimeSeriesResponse,
      string
    >({
      query: (ticker: string) =>
        `?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`,
      transformResponse: (response: AlphaVantageDailyTimeSeriesResponse) => {
        if ('Error Message' in response) {
          throw new Error('Invalid ticker');
        }
        return response;
      },
    }),
  }),
});

export const { useGetDailyAdjustedQuery } = alphaVantageApi;
